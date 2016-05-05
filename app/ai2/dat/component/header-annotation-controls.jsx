'use strict';

const React = require('react');
const AnnotationManager = require('../model/annotation-manager');
const AnnotationManagerEvent = require('../model/annotation-manager-event');
const AnnotationListButton = require('./annotation-list-button.jsx');
const AnnotationProgress = require('./annotation-progress.jsx');
const AnnotationModeSelector = require('./annotation-mode-selector.jsx');
const LabelVisiblityToggle = require('./label-visiblity-toggle.jsx');
const ImageManager = require('../model/image-manager');
const ImageManagerEvent = require('../model/image-manager-event');

class HeaderAnnotationControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      annotations: AnnotationManager.getAnnotations(ImageManager.getCurrentImageId()).all()
    };
    this.updateAnnotations = this.updateAnnotations.bind(this);
  }
  updateAnnotations() {
    this.setState({
      annotations: AnnotationManager.getAnnotations(ImageManager.getCurrentImageId()).all()
    });
  }

  componentDidMount() {
    AnnotationManager.on(
      [
        AnnotationManagerEvent.ANNOTATION_ADDED,
        AnnotationManagerEvent.ANNOTATION_REMOVED
      ],
      this.updateAnnotations
    );
    ImageManager.on(ImageManagerEvent.SELECTED_IMAGE_CHANGED, this.updateAnnotations);
  }
  componentWillUnmount() {
    ImageManager.off(ImageManagerEvent.SELECTED_IMAGE_CHANGED, this.updateAnnotations);
    AnnotationManager.off(
      [
        AnnotationManagerEvent.ANNOTATION_ADDED,
        AnnotationManagerEvent.ANNOTATION_REMOVED,
        ImageManagerEvent.SELECTED_IMAGE_CHANGED
      ],
      this.updateAnnotations()
    );
  }
  render() {
    var klazz = ['flex-align-right', 'flex-row', 'header-annotation-controls',
        this.state.visible ? 'visible' : '' ].join(' ');
    return (
      <div className={klazz}>
        <LabelVisiblityToggle />
        <AnnotationListButton annotations={this.state.annotations} />
        <AnnotationModeSelector />
        <AnnotationProgress />
      </div>
    );
  }
}

module.exports = HeaderAnnotationControls;
