'use strict';

const React = require('react');

const LoadingIndicator = require('./loading-indicator.jsx');
const ImageManager = require('../model/image-manager');
const ImageManagerEvent = require('../model/image-manager-event');
const ShapeAnnotationComponent = require('./shape-annotation-component.jsx');
const ShapeAnnotator = require('./shape-annotator.jsx');
const ContainerAnnotationComponent = require('./container-annotation-component.jsx');
const ContainerAnnotator = require('./container-annotator.jsx');
const AnnotationType = require('../model/annotation-type');
const AnnotationMode = require('../model/annotation-mode');
const AnnotationManager = require('../model/annotation-manager');
const AnnotationManagerEvent = require('../model/annotation-manager-event');
const ArrowAnnotationComponent = require('./arrow-annotation-component.jsx');
const ArrowAnnotator = require('./arrow-annotator.jsx');
const ArrowLabelAnnotator = require('./arrow-label-annotator.jsx');
const RelationshipAnnotator = require('./relationship-annotator.jsx');
const TextAnnotator = require('./text-annotator.jsx');
const TextAnnotationComponent = require('./text-annotation-component.jsx');
const Setting = require('../util/setting');
const SettingsManagerEvent = require('../util/settings-manager-event');
const SettingsManager = require('../util/settings-manager');


class ImageAnnotator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      annotationMode: AnnotationManager.getMode(),
      showLabels: SettingsManager.get(Setting.SHOW_LABELS),
      showArrowLabels: SettingsManager.get(Setting.SHOW_ARROW_LABELS),
      showShapeLabels: SettingsManager.get(Setting.SHOW_SHAPE_LABELS),
      showRelationLabels: SettingsManager.get(Setting.SHOW_RELATION_LABELS),
      showContainerLabels: SettingsManager.get(Setting.SHOW_CONTAINER_LABELS),
      showTextLabels: SettingsManager.get(Setting.SHOW_TEXT_LABELS)
    };
    // This sets up these functions so that they're bound to the current instance, since
    // they're executed as event handlers
    this.loadCurrentImage = this.loadCurrentImage.bind(this);
    this.loadAnnotations = this.loadAnnotations.bind(this);
    this.updateAnnotationMode = this.updateAnnotationMode.bind(this);
    this.updateLabelDisplaySetting = this.updateLabelDisplaySetting.bind(this);
  }
  componentDidMount() {
    SettingsManager.on(SettingsManagerEvent.SETTING_CHANGED, this.updateLabelDisplaySetting);
    ImageManager.on(ImageManagerEvent.SELECTED_IMAGE_CHANGED, this.loadCurrentImage);
    AnnotationManager
      .on(AnnotationManagerEvent.MODE_CHANGED, this.updateAnnotationMode)
      .on(
        [ AnnotationManagerEvent.ANNOTATION_ADDED, AnnotationManagerEvent.ANNOTATION_REMOVED ],
        this.loadAnnotations
      );
    ImageManager.selectNextImage();
  }
  componentWillUnmount() {
    console.log('here');
    SettingsManager.off(SettingsManagerEvent.SETTING_CHANGED, this.updateLabelDisplaySetting);
    ImageManager.off(ImageManagerEvent.SELECTED_IMAGE_CHANGED, this.loadCurrentImage);
    AnnotationManager
      .off(AnnotationManagerEvent.MODE_CHANGED, this.updateAnnotationMode)
      .off(
        [ AnnotationManagerEvent.ANNOTATION_ADDED, AnnotationManagerEvent.ANNOTATION_REMOVED ],
        this.loadAnnotations
      );
  }
  updateLabelDisplaySetting() {
    this.setState({
      showLabels: SettingsManager.get(Setting.SHOW_LABELS),
      showArrowLabels: SettingsManager.get(Setting.SHOW_ARROW_LABELS),
      showShapeLabels: SettingsManager.get(Setting.SHOW_SHAPE_LABELS),
      showRelationLabels: SettingsManager.get(Setting.SHOW_RELATION_LABELS),
      showContainerLabels: SettingsManager.get(Setting.SHOW_CONTAINER_LABELS),
      showTextLabels: SettingsManager.get(Setting.SHOW_TEXT_LABELS)
    });
  }
  updateAnnotationMode() {
    this.setState({
      annotationMode: AnnotationManager.getMode(),
    });
  }
  loadAnnotations() {
    this.setState({
      annotations: AnnotationManager.getAnnotations(this.state.imageId)
    });
  }
  loadCurrentImage() {
    var image = ImageManager.getCurrentImage();
    AnnotationManager.resetAnnotations(image.id);
    var imageAnnotator = this;

    this.setState({
      imageId: image.id,
      imageUrl: image.url,
      error: undefined,
      loading: true,
      annotations: []
    });

    AnnotationManager.importRemoteAnnotations(image, function(){
      imageAnnotator.loadAnnotations();
      imageAnnotator.setState({loading: false});
    });
  }
  renderAnnotations() {
    var annotations = [];
    if (this.state.annotations && this.state.annotations.count() > 0) {
      var annotationsByType = this.state.annotations.groupedByType();

      if (annotationsByType.has(AnnotationType.SHAPE)) {
        annotationsByType.get(AnnotationType.SHAPE).forEach(function(annotation) {
          annotations.push(
            <ShapeAnnotationComponent
                key={annotation.id}
                imageId={this.state.imageId}
                annotation={annotation} />
          );
        }.bind(this));
      }

      if (annotationsByType.has(AnnotationType.CONTAINER)) {
        annotationsByType.get(AnnotationType.CONTAINER).forEach(function(annotation) {
          annotations.push(
            <ContainerAnnotationComponent
                key={annotation.id}
                imageId={this.state.imageId}
                annotation={annotation} />
          );
        }.bind(this));
      }

      if (annotationsByType.has(AnnotationType.ARROW)) {
        annotationsByType.get(AnnotationType.ARROW).forEach(function(annotation) {
          annotations.push(
            <ArrowAnnotationComponent
                key={annotation.id}
                imageId={this.state.imageId}
                annotation={annotation} />
          );
        }.bind(this));
      }

      if (annotationsByType.has(AnnotationType.TEXT)) {
        annotationsByType.get(AnnotationType.TEXT).forEach(function(annotation) {
          annotations.push(
              <TextAnnotationComponent
                key={annotation.id}
                imageId={this.state.imageId}
                annotation={annotation} />
            );
        }.bind(this));
      }
    }
    return annotations;
  }
  renderAnnotator() {
    var annotator;

    var annotations = this.renderAnnotations();
    switch (this.state.annotationMode) {
      case AnnotationMode.SHAPES:
        annotator = (
          <ShapeAnnotator
              showLabels={this.state.showLabels}
              imageUrl={this.state.imageUrl}
              imageId={this.state.imageId}
              annotations={annotations} />
        );
        break;
      case AnnotationMode.CONTAINERS:
        annotator = (
          <ContainerAnnotator
              showLabels={this.state.showLabels}
              imageUrl={this.state.imageUrl}
              imageId={this.state.imageId}
              annotations={annotations} />
        );
        break;
      case AnnotationMode.ARROWS:
        annotator = (
          <ArrowAnnotator
              showLabels={this.state.showLabels}
              imageUrl={this.state.imageUrl}
              imageId={this.state.imageId}
              annotations={annotations} />
        );
        break;
      case AnnotationMode.RELATIONSHIPS:
        annotator = (
          <RelationshipAnnotator
            showLabels={this.state.showLabels}
            imageUrl={this.state.imageUrl}
            imageId={this.state.imageId}
            annotations={annotations} />
        );
        break;
      case AnnotationMode.ARROW_LABELS:
        annotator = (
          <ArrowLabelAnnotator
            showLabels={this.state.showLabels}
            imageUrl={this.state.imageUrl}
            imageId={this.state.imageId}
            annotations={annotations} />
        );
        break;
      case AnnotationMode.TEXT:
        annotator = (
          <TextAnnotator
            showLabels={this.state.showLabels}
            imageUrl={this.state.imageUrl}
            imageId={this.state.imageId}
            annotations={annotations} />
        );
        break;
    }
    return annotator;
  }
  render() {
    var content;
    if (this.state.loading) {
      content = <LoadingIndicator />;
    } else if (this.state.error) {
      content = <div className="hcenter vcenter msg msg-error">{this.state.error}</div>;
    } else if(this.state.imageUrl) {
      var className='annotator';
      if (!this.state.showArrowLabels) {className += ' hide-arrow-labels';}
      if (!this.state.showShapeLabels) {className += ' hide-shape-labels';}
      if (!this.state.showRelationLabels) {className += ' hide-relation-labels';}
      if (!this.state.showContainerLabels) {className += ' hide-container-labels';}
      if (!this.state.showTextLabels) {className += ' hide-text-labels';}
      return <div className={className}>{this.renderAnnotator()}</div>;
    }
    return content;
  }
}

module.exports = ImageAnnotator;
