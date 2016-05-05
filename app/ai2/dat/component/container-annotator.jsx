'use strict';

const React = require('react');

const AnnotationBounds = require('./annotation-bounds.jsx');
const AnnotationManager = require('../model/annotation-manager');
const AnnotationType = require('../model/annotation-type');
const Bounds = require('../model/bounds');
const ContainerAnnotation = require('../model/container-annotation');
const Annotator = require('./annotator.jsx');

class ContainerAnnotator extends Annotator {
  constructor(props) {
    super(props);
    this.startNewAnnotation = this.startNewAnnotation.bind(this);
    this.updateNewAnnotationDimensions = this.updateNewAnnotationDimensions.bind(this);
    this.addNewAnnotation = this.addNewAnnotation.bind(this);
  }
  startNewAnnotation(event) {
    event.preventDefault();
    this.setState({
      annotating: true,
      firstPoint: this.getPoint(event)
    });
  }
  updateNewAnnotationDimensions(event) {
    event.preventDefault();
    this.setState({
      secondPoint: this.getPoint(event)
    });
  }
  cancel() {
    this.setState({
      annotating: false,
      firstPoint: undefined,
      secondPoint: undefined
    });
  }
  addNewAnnotation(event) {
    event.preventDefault();
    var annotation = new ContainerAnnotation(
      AnnotationManager.getNewAnnotationId(AnnotationType.CONTAINER),
      new Bounds(this.state.firstPoint, this.state.secondPoint)
    );
    this.setState({
      annotating: false,
      firstPoint: undefined,
      secondPoint: undefined
    });
    AnnotationManager.addAnnotation(this.props.imageId, annotation);
  }
  render() {
    var onMouseMove, onMouseDown;

    if (this.state.annotating) {
      onMouseMove = this.updateNewAnnotationDimensions;
      onMouseDown = this.addNewAnnotation;
    } else {
      onMouseDown = this.startNewAnnotation;
    }

    var rect;
    if (this.state.annotating && this.state.firstPoint && this.state.secondPoint) {
      rect = (
        <AnnotationBounds
            x1={this.state.firstPoint.x}
            y1={this.state.firstPoint.y}
            x2={this.state.secondPoint.x}
            y2={this.state.secondPoint.y} />
      );
    }

    var cssClass = 'annotation-pane container-annotation-pane';

    return (
      <div className={cssClass} onMouseMove={onMouseMove}>
        <div
            className="annotation-pane-image"
            onMouseDown={onMouseDown}
            onMouseMove={this.updateCrosshairs}
            ref="origin">
          {this.crosshairs()}
          <img src={this.props.imageUrl} className="hcenter vcenter" />
          {this.props.annotations}
          {rect}
        </div>
      </div>
    );
  }
}

module.exports = ContainerAnnotator;
