'use strict';

const React = require('react');
const HeaderAnnotationControls = require('./header-annotation-controls.jsx');
const ImageAnnotator = require('./image-annotator.jsx');
const ImageManager = require('../model/image-manager');
const ImageManagerEvent = require('../model/image-manager-event');
const AnnotationManager = require('../model/annotation-manager');
const Messages = require('./messages.jsx');
const KeyMaster = require('../util/key-master');
const KeyCode = require('../util/key-code');
const CategorySelector = require('./category-selector.jsx');


class DiagramAnnotationTool extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasImages: false };
    this.handleNewImageSet = this.handleNewImageSet.bind(this);
    this.saveAndAdvance = this.saveAndAdvance.bind(this);
  }
  handleNewImageSet() {
    AnnotationManager.clear();
    if (ImageManager.getTotalFinishedImageCount() > 0) {
      this.setState({ hasImages: true });
    }
  }
  componentDidMount() {
    ImageManager.on(ImageManagerEvent.NEW_IMAGES, this.handleNewImageSet);

    KeyMaster.on(KeyCode.ARROW_RIGHT, function(event) {
      if (ImageManager.getTotalFinishedImageCount() > 1) {
        ImageManager.selectNextFinshedImage();
        event.stopPropagation();
      }
    });

    KeyMaster.on(KeyCode.ARROW_LEFT, function(event) {
      if (ImageManager.getTotalFinishedImageCount() > 1) {
        ImageManager.selectPreviousFinshedImage();
        event.stopPropagation();
      }
    });
    ImageManager.loadFinishedImageIds();
  }
  componentWillUnmount() {
    ImageManager.off(ImageManagerEvent.NEW_IMAGES, this.handleNewImageSet);
    KeyMaster.unmount();
    window.onbeforeunload = undefined;
  }
  renderView() {
    var view = <ImageAnnotator />;
    return view;
  }
  renderCategoryPicker(){
    var sidebar = <CategorySelector />;
    return sidebar;
  }
  saveAndAdvance() {
    ImageManager.finishCurrentImage();
    var image_id = ImageManager.getCurrentImageId();
    var annotation_map = AnnotationManager.getAnnotations(image_id);
    AnnotationManager.saveAnnotations(image_id, annotation_map);
    ImageManager.selectNextImage();
  }

  cancelDragOver(event) {
    event.preventDefault();
  }

  render() {
    var view = this.renderView();
    var sidebar = this.renderCategoryPicker();
    return (
      <div className="diagram-annotation-tool"
          onDragOver={this.cancelDragOver}>
        <header className="padded flex-row">
          <h1>Textbook Annotation Tool</h1>
          <HeaderAnnotationControls />
        </header>
        <main>
          <Messages />
          {sidebar}
          {view}
        </main>
        <footer className="padded flex-row">
          <a href="http://allenai.org" target="_blank" className="made-by-ai2 flex-align-left">
            <strong>Made By:</strong>
            <img src="assets/images/logo@2x.png" width="33" height="25" alt="AI2" />
          </a>
          <div className="flex-align-right">
            <button onClick={this.saveAndAdvance} className="btn-green">Save and Advance</button>
          </div>
        </footer>
      </div>
    );
  }
}

module.exports = DiagramAnnotationTool;


