'use strict';

const React = require('react');

const AnnotationType = require('../model/annotation-type');
const AnnotationManager = require('../model/annotation-manager');
const AnnotationBounds = require('./annotation-bounds.jsx');
const ArrowAnnotation = require('../model/arrow-annotation');
const ArrowAnnotationComponent = require('./arrow-annotation-component.jsx');
const ArrowPointBounds = require('../model/arrow-point-bounds');
const MessageManager = require('../util/message-manager');
const KeyMaster = require('../util/key-master');
const KeyCode = require('../util/key-code');
const Annotator = require('./annotator.jsx');
const Point = require('../model/point');

const ArrowAnnotationMode = {
  ORIGIN: 'Origin',
  DESTINATION: 'Destination'
};
Object.freeze(ArrowAnnotationMode);

class ArrowAnnotator extends Annotator {
  constructor(props) {
    super(props);
    this.state = { annotating: false, mode: ArrowAnnotationMode.ORIGIN, hoverPoint: new Point(0,0) };

    this.startRectangle = this.startRectangle.bind(this);
    this.updateRectangleDimensions = this.updateRectangleDimensions.bind(this);
    this.addRectangleToAnnotation = this.addRectangleToAnnotation.bind(this);
    this.startAddingArrow = this.startAddingArrow.bind(this);
    this.cancel = this.cancel.bind(this);
    this.addAnnotation = this.addAnnotation.bind(this);
    this.disableRightClickMenu = this.disableRightClickMenu.bind(this);
    this.startNewArrowOrSaveCurrent = this.startNewArrowOrSaveCurrent.bind(this);
  }
  disableRightClickMenu(e) {
    e.preventDefault();
  }
  componentDidMount() {
    super.componentDidMount();
    React.findDOMNode(this.refs.container)
        .addEventListener('contextmenu', this.disableRightClickMenu);
    KeyMaster.on(KeyCode.ENTER, this.startNewArrowOrSaveCurrent);
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    React.findDOMNode(this.refs.container)
        .removeEventListener('contextmenu', this.disableRightClickMenu);
    KeyMaster.off(KeyCode.ENTER);
  }
  startRectangle(event) {
    this.setState({
      firstPoint: this.getPoint(event),
      secondPoint: undefined,
      mode: event.button !== 0 ? ArrowAnnotationMode.DESTINATION : ArrowAnnotationMode.ORIGIN
    });
  }
  updateRectangleDimensions(event) {
    event.preventDefault();
    this.setState({
      secondPoint: this.getPoint(event)
    });
  }
  startNewArrowOrSaveCurrent(event) {
    event.preventDefault();
    if (this.state.annotation) {
      this.addAnnotation();
    } else {
      this.startAddingArrow();
    }
  }
  addRectangleToAnnotation(event) {
    event.preventDefault();
    var isOrigin = this.state.mode === ArrowAnnotationMode.ORIGIN;
    var id;
    if (isOrigin) {
      id = this.state.annotation.getNextOriginId();
    } else {
      id = this.state.annotation.getNextDestinationId();
    }
    var bounds = new ArrowPointBounds(
      id,
      0,
      this.state.firstPoint,
      this.state.secondPoint
    );
    if (isOrigin) {
      this.state.annotation.addOrigin(bounds);
    } else {
      this.state.annotation.addDestination(bounds);
    }
    this.setState({
      firstPoint: undefined,
      secondPoint: undefined
    });
  }
  startAddingArrow() {
    this.setState({
      annotating: true,
      annotation: new ArrowAnnotation(
        AnnotationManager.getNewAnnotationId(AnnotationType.ARROW)
      )
    });
  }
  cancel() {
    this.setState({
      annotating: false,
      mode: ArrowAnnotationMode.ORIGIN,
      annotation: undefined,
      firstPoint: undefined,
      secondPoint: undefined
    });
  }
  addAnnotation() {
    var a = this.state.annotation;
    if (a && a.isValid()) {
      this.setState({
        annotating: false,
        mode: ArrowAnnotationMode.ORIGIN,
        annotation: undefined
      });
      AnnotationManager.addAnnotation(this.props.imageId, a);
    } else {
      MessageManager.error(
        'You can\'t add that arrow as it doesn\'t have at least one origin and one destination'
      );
    }
  }
  renderControls() {
    var controls;
    if (this.state.annotating) {
      controls = (
        <div className="flex-row">
          <button className="flex-align-left btn-sm btn-transparent"
              onClick={this.cancel}>Cancel</button>
          <button className="flex-align-right btn-sm btn-green"
              onClick={this.addAnnotation}>Save</button>
        </div>
      );
    } else {
      controls = (
        <button className="btn-sm btn-green btn-add"
            onClick={this.startAddingArrow}>
          Add New Arrow
        </button>
      );
    }
    return controls;
  }
  render() {
    var onMouseMove, onMouseDown, cssClass;

    cssClass = 'annotation-pane';

    var crosshairs;
    var onMouseMoveCrosshairs;

    if (this.state.annotating) {
      crosshairs = this.crosshairs();
      onMouseMoveCrosshairs = this.updateCrosshairs;
      if (this.state.firstPoint) {
        onMouseMove = this.updateRectangleDimensions;
        onMouseDown = this.addRectangleToAnnotation;
      } else {
        onMouseDown = this.startRectangle;
      }
      cssClass += ' arrow-annotation-pane';
    }

    var controls = this.renderControls();

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

    var annotation;
    if (this.state.annotation) {
      annotation = (
        <ArrowAnnotationComponent
          imageId={this.props.imageId}
          annotation={this.state.annotation} />
      );
    }

    return (
      <div className={cssClass} onMouseMove={onMouseMove} ref="container">
        <div className="arrow-annotation-controls">
          {controls}
        </div>
        <div
            className="annotation-pane-image"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMoveCrosshairs}
            ref="origin">
            {crosshairs}
          <img src={this.props.imageUrl} className="hcenter vcenter" />
          {rect}
          {annotation}
          {this.props.annotations}
        </div>
      </div>
    );
  }
}

module.exports = ArrowAnnotator;
