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
    // ImageManager.loadFinishedImageIds();
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
  populate_fields(name, val){
    var form = document.forms[0];
    form[name].value=val;
  }
  saveAndAdvance() {
    var image_id = ImageManager.getCurrentImageId();
    var annotation_map = AnnotationManager.getAnnotations(image_id);
    var annotation_results = AnnotationManager.saveAnnotations(image_id, annotation_map);
    this.populate_fields('image_id', image_id);
    this.populate_fields('results', annotation_results);
    var form = document.forms[0];
    form.submit()
  }
  cancelDragOver(event) {
    event.preventDefault();
  }
  getHITParams() {
    var params = ImageManager.getUrlParams();
    console.log(params);
    return params
  }
  render() {
    var view = this.renderView();
    var sidebar = this.renderCategoryPicker();
    var url_params = this.getHITParams();
    var image_id = ImageManager.getCurrentImageId();
    return (
      <div className="diagram-annotation-tool"
          onDragOver={this.cancelDragOver}>
        <header className="padded flex-row">
          <h1>Textbook Annotation Tool</h1>
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
            <form action= "https://workersandbox.mturk.com/mturk/externalSubmit"
                  method="POST">
              <input type="hidden" name="assignmentId" id="myAssignmentId" value={url_params.assignmentId} />
              <input type="hidden" name="image_id" id="image_id" value = ""/>
              <input type="hidden" name="results" id="results" value = "" />
            </form>
            <button onClick={this.saveAndAdvance} className="btn-green">Save and Advance</button>
          </div>
        </footer>
      </div>
    );
  }
}
//            <button onClick={this.saveAndAdvance} className="btn-green">Save and Advance</button>

// <form action="http://www.mturk.com/mturk/externalSubmit"
module.exports = DiagramAnnotationTool;



