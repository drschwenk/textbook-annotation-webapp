'use strict';

const React = require('react');

const AnnotationBounds = require('./annotation-bounds.jsx');
const RelateableComponent = require('./relateable-component.jsx');

class TextAnnotationComponent extends RelateableComponent {
  constructor(props) {
    super(props);
  }
  render() {
    var label = this.props.annotation.id;
    if (this.props.annotation.text) {
      label += ': \u201C' + this.props.annotation.text + '\u201D';
    }
    const cssClass = this.getRelatedCssClass();
    const relationshipLabels = this.renderRelationshipLabels();
    const bounds = this.props.annotation.bounds.getBoundingRectangle();
    return (
      <AnnotationBounds
          className={cssClass}
          textLabel={label}
          relationshipLabels={relationshipLabels}
          onClick={this.onClick}
          x1={bounds.left}
          y1={bounds.top}
          x2={bounds.right}
          y2={bounds.bottom} />
    );
  }
}

module.exports = TextAnnotationComponent;