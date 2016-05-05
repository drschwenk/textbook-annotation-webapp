'use strict';

const React = require('react');

const AnnotationBounds = require('./annotation-bounds.jsx');
const RelateableComponent = require('./relateable-component.jsx');

class ShapeAnnotationComponent extends RelateableComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const bounds = this.props.annotation.bounds.getBoundingRectangle();
    const cssClass = this.getRelatedCssClass();
    const relationshipLabels = this.renderRelationshipLabels();
    return (
      <AnnotationBounds
          className={cssClass}
          shapeLabel={this.props.annotation.id}
          relationshipLabels={relationshipLabels}
          onClick={this.onClick}
          x1={bounds.left}
          y1={bounds.top}
          x2={bounds.right}
          y2={bounds.bottom} />
    );
  }
}

module.exports = ShapeAnnotationComponent;