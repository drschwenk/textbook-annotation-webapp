'use strict';

const React = require('react');

const AnnotationType = require('../model/annotation-type');
const AnnotationManager = require('../model/annotation-manager');
const AnnotationBounds = require('./annotation-bounds.jsx');
const TextAnnotation = require('../model/text-annotation');
const Bounds = require('../model/bounds');
const KeyCode = require('../util/key-code');
const Annotator = require('./annotator.jsx');

class TextAnnotator extends Annotator {
  constructor(props) {
    super(props);

    this.startRectangle = this.startRectangle.bind(this);
    this.updateRectangleDimensions = this.updateRectangleDimensions.bind(this);
    this.promptForTextContent = this.promptForTextContent.bind(this);
    this.addAnnotation = this.addAnnotation.bind(this);
    this.setText = this.setText.bind(this);
    this.addOnEnter = this.addOnEnter.bind(this);
  }
  componentDidUpdate() {
    if (this.state.bounds) {
      window.requestAnimationFrame(function() {
        React.findDOMNode(this.refs.text).focus();
      }.bind(this));
    }
  }
  startRectangle(event) {
    event.preventDefault();
    this.setState({
      annotating: true,
      firstPoint: this.getPoint(event),
      secondPoint: undefined
    });
  }
  updateRectangleDimensions(event) {
    event.preventDefault();
    this.setState({
      secondPoint: this.getPoint(event)
    });
  }
  promptForTextContent() {
    var bounds = new Bounds(this.state.firstPoint, this.state.secondPoint);
    this.setState({
      bounds: bounds
    });
  }
  cancel() {
    this.setState({
      annotating: false,
      bounds: undefined,
      text: undefined,
      firstPoint: undefined,
      secondPoint: undefined
    });
  }
  addAnnotation() {
    var id = AnnotationManager.getNewAnnotationId(AnnotationType.TEXT);
    var annotation = new TextAnnotation(id, this.state.bounds, this.state.text);
    this.setState({
      annotating: false,
      bounds: undefined,
      text: undefined,
      firstPoint: undefined,
      secondPoint: undefined
    });
    AnnotationManager.addAnnotation(this.props.imageId, annotation);
  }
  setText(event) {
    this.setState({ text: event.target.value });
  }
  addOnEnter(event) {
    switch (event.keyCode) {
      case KeyCode.ENTER:
        this.addAnnotation();
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  }
  renderOverlay() {
    return (
      <div className="annotation-pane-overlay">
        <div className="annotation-pane-dialog">
          <div className="annotation-pane-dialog-header flex-row">
            <span>Enter the Text Content</span>
            <a className="icon-x flex-align-right"
                onClick={this.addAnnotation}></a>
          </div>
          <div className="annotation-pane-dialog-content">
            <p>
              <input type="text"
                  onChange={this.setText}
                  onKeyDown={this.addOnEnter}
                  ref="text" />
            </p>
            <button onClick={this.addAnnotation} className="btn-green">Save</button>
          </div>
        </div>
      </div>
    );
  }
  render() {
    var onMouseDown, onMouseMove,
        overlay, cssClass;

    cssClass = 'annotation-pane';

    if (!this.state.bounds) {
      if (!this.state.firstPoint) {
        onMouseDown = this.startRectangle;
      } else {
        onMouseMove = this.updateRectangleDimensions;
        onMouseDown = this.promptForTextContent;
      }
      cssClass += ' text-annotation-pane';
    } else {
      overlay = this.renderOverlay();
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
    return (
      <div className={cssClass} onMouseMove={onMouseMove}>
        <div className="annotation-pane-image"
            onMouseDown={onMouseDown}
            onMouseMove={this.updateCrosshairs.bind(this)}
            ref="origin">
          {this.crosshairs()}
          <img src={this.props.imageUrl} className="hcenter vcenter" />
          {this.props.annotations}
          {rect}
        </div>
        {overlay}
      </div>
    );
  }
}

module.exports = TextAnnotator;
