'use strict';

const React = require('react');

const ImageManager = require('../model/image-manager');
const ImageManagerEvent = require('../model/image-manager-event');

class AnnotationProgress extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = this.getSyncedState();
  }
  getSyncedState() {
    return {
      index: ImageManager.getCurrentFinishedImageIndex() + 1,
      total: ImageManager.getTotalFinishedImageCount()
    };
  }
  componentDidMount() {
    ImageManager.on(ImageManagerEvent.FINISHED_IMAGES_LOADED, this.update);
    ImageManager.on(ImageManagerEvent.SELECTED_IMAGE_CHANGED, this.update);
  }
  componentWillUnmount() {
    ImageManager.off(ImageManagerEvent.FINISHED_IMAGES_LOADED, this.update);
    ImageManager.off(ImageManagerEvent.SELECTED_IMAGE_CHANGED, this.update);
  }
  selectPreviousFinished() {
    ImageManager.selectPreviousFinishedImage();
  }
  selectNextFinished() {
    ImageManager.selectNextFinishedImage();
  }
  update() {
    console.log("calling update");
    this.setState(this.getSyncedState());
  }
  render() {
    return (
      <div className="flex-row annotation-position">
        <button className="btn-yellow icon-pointer_left flex-align-left"
            onClick={this.selectPreviousFinished}></button>
        <span>{this.state.index} / {this.state.total}</span>
        <button className="btn-yellow icon-pointer_right flex-align-right"
            onClick={this.selectNextFinished}></button>
      </div>
    );
  }
}

module.exports = AnnotationProgress;
