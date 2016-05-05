'use strict';

const React = require('react');

const AnnotationBounds = require('./annotation-bounds.jsx');
const AnnotationManager = require('../model/annotation-manager');
const AnnotationType = require('../model/annotation-type');
const KeyCode = require('../util/key-code');
const Bounds = require('../model/bounds');
const RelationshipAnnotation = require('../model/relationship-annotation');
const ShapeAnnotation = require('../model/shape-annotation');
const Annotator = require('./annotator.jsx');

const EMPTY_TEXT_ANNOTATION = "EMPTY_TEXT_ANNOTATION";

class ShapeAnnotator extends Annotator {
  constructor(props) {
    super(props);

    this.startNewAnnotation = this.startNewAnnotation.bind(this);
    this.updateNewAnnotationDimensions = this.updateNewAnnotationDimensions.bind(this);
    this.setSelectedTextAnnotation = this.setSelectedTextAnnotation.bind(this);
    this.setText = this.setText.bind(this);
    this.addNewAnnotation = this.addNewAnnotation.bind(this);
    this.setBounds = this.setBounds.bind(this);
  }
  startNewAnnotation(event) {
    event.preventDefault();
    this.setState({
      annotating: true,
      firstPoint: this.getPoint(event),
      bounds: undefined,
      selectedTextAnnotation: undefined,
      text: undefined
    });
  }
  updateNewAnnotationDimensions(event) {
    event.preventDefault();
    this.setState({ secondPoint: this.getPoint(event)});
  }

  setSelectedTextAnnotation(event) {
    switch(event.target.value) {
      case EMPTY_TEXT_ANNOTATION:
        this.setState({ 
          selectedTextAnnotation: undefined,
          text: undefined
        });
        break;
      default:
        this.setState({ 
          selectedTextAnnotation: event.target.value,
          text: undefined
        });
    }
  }

  setText(event) {
    this.setState({ 
      text: event.target.value,
      selectedTextAnnotation: undefined
    });
  }

  cancel() {
    this.setState({
      annotating: false,
      selectedTextAnnotation: undefined,
      bounds: undefined,
      text: undefined,
      firstPoint: undefined,
      secondPoint: undefined
    });
  }

  addNewAnnotation(event) {
    event.preventDefault();

    var annotation = new ShapeAnnotation(
      AnnotationManager.getNewAnnotationId(AnnotationType.SHAPE),
      new Bounds(this.state.firstPoint, this.state.secondPoint),
      this.state.text
    );

    if (this.state.selectedTextAnnotation) {
      var textAnnotation = AnnotationManager.getAnnotation(
          this.props.imageId, 
          this.state.selectedTextAnnotation
      );
      var relationship = new RelationshipAnnotation(
          AnnotationManager.getNewAnnotationId(AnnotationType.RELATIONSHIP)
      );

      relationship.setSourceId(textAnnotation.id);
      relationship.setTargetId(annotation.id);
      annotation.addRelationship(relationship);
    }

    AnnotationManager.addAnnotation(this.props.imageId, annotation);
    this.cancel();
  }

  addOnEnter(event) {
    switch (event.keyCode) {
      case KeyCode.ENTER:
        this.addNEwAnnotation();
        event.preventDefault();
        event.stopPropagation();
        break;
    }
  }

  setBounds() {
    var bounds = new Bounds(this.state.firstPoint, this.state.secondPoint);
    this.setState({
      bounds: bounds
    });
  }

  renderOverlay() {

    // copying array since sort() modifies the receiver
    var textAnnotations = AnnotationManager.getAnnotations(this.props.imageId)
      .groupedByType()
      .get("text")
      .slice();

    var shapeBounds = this.state.bounds;
    textAnnotations.sort(function(a, b) {
         return a.bounds.distance(shapeBounds) - b.bounds.distance(shapeBounds);
    });

    var options = textAnnotations.map(function(a, index) {
      return <option key={index + 1} value={a.id}>{a.text}</option>;
    });
    options.unshift(<option key="0" value={EMPTY_TEXT_ANNOTATION}>Select or Enter a Text Label</option>);

    var textbox;
    if (!this.state.selectedTextAnnotation) {
      textbox = (
          <p>
              <input type="text"
                  onChange={this.setText}
                  onKeyDown={this.addOnEnter}
                  ref="text" />
          </p>);
    }

    var saveDisabled = true;

    if (this.state.selectedTextAnnotation || this.state.text) {
      saveDisabled = false;
    }

    return (
      <div className="annotation-pane-overlay">
        <div className="annotation-pane-dialog">
          <div className="annotation-pane-dialog-header flex-row">
            <span>Enter Label for Shape</span>
            <a className="icon-x flex-align-right"
                onClick={this.cancel}></a>
          </div>
          <div className="annotation-pane-dialog-content">
          <p>
            <select onChange={this.setSelectedTextAnnotation}>{options}</select>
          </p>

            {textbox}
            <p>
            <button disabled={saveDisabled} onClick={this.addNewAnnotation} className="btn-green">Save</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    var onMouseMove, onMouseDown, overlay;

    if (!this.state.bounds) {
      if (!this.state.firstPoint) {
        onMouseDown = this.startNewAnnotation;
      } else {
        onMouseMove = this.updateNewAnnotationDimensions;
        onMouseDown = this.setBounds;
      }
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

    var cssClass = 'annotation-pane shape-annotation-pane';

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
        {overlay}
      </div>
    );
  }
}

module.exports = ShapeAnnotator;
