'use strict';

const ImageManagerEvent = {
  NEW_IMAGES: 'new-images',
  FINISHED_IMAGES_LOADED: 'finished-images-loaded',
  SELECTED_IMAGE_CHANGED: 'selected-image-changed'
};
Object.freeze(ImageManagerEvent);

module.exports = ImageManagerEvent;
