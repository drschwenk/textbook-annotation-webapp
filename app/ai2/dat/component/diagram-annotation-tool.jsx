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
  set_header(){
    AnnotationManager.setCurrentCategory('Header/Topic');
  }
  set_discussion(){
    AnnotationManager.setCurrentCategory('Discussion');
  }
  set_definition(){
    AnnotationManager.setCurrentCategory('Definition');
  }
  set_question(){
    AnnotationManager.setCurrentCategory('Question');
  }
  set_answer(){
    AnnotationManager.setCurrentCategory('Answer');
  }
  set_fl(){
    AnnotationManager.setCurrentCategory('Figure Label');
  }
  set_other(){
    AnnotationManager.setCurrentCategory('Other');
  }
  componentDidMount() {
    ImageManager.on(ImageManagerEvent.NEW_IMAGES, this.handleNewImageSet);

    KeyMaster.on(KeyCode.Enter, this.saveAndAdvance);
    KeyMaster.on(KeyCode.Other, this.set_other);
    KeyMaster.on(KeyCode.Header_Topic, this.set_header);
    KeyMaster.on(KeyCode.Discussion, this.set_discussion);
    KeyMaster.on(KeyCode.Definition,this.set_definition);
    KeyMaster.on(KeyCode.Question, this.set_question);
    KeyMaster.on(KeyCode.Answer, this.set_answer);
    KeyMaster.on(KeyCode.Figure_Lable, this.set_fl);
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
    this.populate_fields('results', annotation_results);
    var form = document.forms[0];
    form.submit();
  }
  cancelDragOver(event) {
    event.preventDefault();
  }
  getHITParams() {
    var params = ImageManager.getUrlParams();
    return params
  }
  render() {
    var url_params = this.getHITParams();
    var view = this.renderView();
    var sidebar = this.renderCategoryPicker();
    return (
      <div className="diagram-annotation-tool"
          onDragOver={this.cancelDragOver}>
        <header className="padded flex-row">
          <button onClick={this.saveAndAdvance} className="btn-green">Save and Advance</button>
          <h1 className=" flex-align-right">Textbook Annotation Tool</h1>
          <a href="http://allenai.org" target="_blank" className="made-by-ai2 flex-align-right">
            <strong>Made By:</strong>
            <img src="assets/images/logo@2x.png" width="33" height="25" alt="AI2" />
          </a>
        </header>
        <main>
          <Messages />
          {sidebar}
          {view}
        </main>
          <div className="flex-align-right">
            <form action= "https://workersandbox.mturk.com/mturk/externalSubmit"
                  method="POST">
              <input type="hidden" name="assignmentId" id="myAssignmentId" value={url_params.assignmentId} />
              <input type="hidden" name="image_id" id="image_id" value = {url_params.url}/>
              <input type="hidden" name="results" id="results" value = "" />
            </form>
          </div>
      </div>
    );
  }
}

// <form action="http://www.mturk.com/mturk/externalSubmit"
module.exports = DiagramAnnotationTool;



