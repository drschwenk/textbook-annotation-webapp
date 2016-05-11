'use strict';

const EventEmitter = require('../util/event-emitter');
const ImageManagerEvent = require('./image-manager-event');
const Reader = require('../util/reader');
const Agent = require('../util/agent');

class ImageManager extends EventEmitter {
  constructor() {
    super();
    this.currentImage = undefined;
    this.currentFinishedImageIndex = 0;
    this.setFinishedImageIds([]);
  }
  isSupported() {
    return Reader.isSupported;
  }
  getTotalFinishedImageCount() {
    return this.finishedImageIds.length;
  }
  getCurrentFinishedImageIndex() {
    return this.currentFinishedImageIndex;
  }
  hasImage(index) {
    return this.images.hasOwnProperty(index);
  }
  hasImageWithName(name) {
    return this.images.some(function(img) {
      return img.name === name;
    });
  }
  hasImages() {
    return this.getTotalFinishedImageCount() > 0;
  }
  hasCurrentImage() {
    return this.hasImage(this.getCurrentImageIndex());
  }
  getCurrentImage() {
    return this.currentImage;
  }
  getCurrentImageId() {
    return this.getCurrentImage() ? this.getCurrentImage().id : undefined;
  }

  nextFinishedImage() {
    Agent.nextFinishedImage(function(image) {
      this.currentImage = image;
      this.emit(ImageManagerEvent.SELECTED_IMAGE_CHANGED, this.currentImage);
    }.bind(this));
    return this;
  }

  nextImage() {
    Agent.nextImage(function(image) {
      this.currentImage = image;
      console.log(image);
      this.emit(ImageManagerEvent.SELECTED_IMAGE_CHANGED, this.currentImage);
    }.bind(this));
    return this;
  }

  finishCurrentImage() {
    var image = this.getCurrentImage();
    image.state = "finished";
    Agent.updateImage(image);
  }

  selectImage(imageId) {
    Agent.getImage(imageId, function(image) {
      this.currentImage = image;
      this.emit(ImageManagerEvent.SELECTED_IMAGE_CHANGED, this.currentImage);
    }.bind(this));
    return this;
  }

  selectPreviousFinishedImage() {
    this.currentFinishedImageIndex -= 1;
    if (this.currentFinishedImageIndex < 0) {
      this.currentFinishedImageIndex = this.finishedImageIds.length - 1;
    }
    return this.selectImage(this.finishedImageIds[this.currentFinishedImageIndex]);
  }

  selectNextFinishedImage() {
    this.currentFinishedImageIndex += 1;
    if (this.currentFinishedImageIndex >= this.finishedImageIds.length) {
      this.currentFinishedImageIndex = 0;
    }
    return this.selectImage(this.finishedImageIds[this.currentFinishedImageIndex]);
  }

  selectNextImage() {
    return this.nextImage();
  }

  setFinishedImageIds(imageIds) {
    this.finishedImageIds = imageIds;
  }

  loadFinishedImageIds() {
    Agent.getFinishedImageIds(function(imageIds) {
      this.setFinishedImageIds(imageIds);
      this.currentFinishedImageIndex = 0;
      this.emit(ImageManagerEvent.FINISHED_IMAGES_LOADED);
    }.bind(this));
  }


  removeAllImages() {
    this.images = [];
  }
}

module.exports = new ImageManager();
