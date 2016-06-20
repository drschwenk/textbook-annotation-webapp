'use strict';

const React = require('react');

const AnnotationBounds = require('./annotation-bounds.jsx');
const QuestionComponent = require('./test-annotation-component.jsx');

class QuestionComponent extends TextAnnotationComponent{
  constructor(props) {
    super(props);
  }
  render() {
    var question_type = this.props.annotation.category;
    const cssClass = this.getRelatedCssClass();
    const relationshipLabels = this.renderRelationshipLabels();
    const bounds = this.props.annotation.bounds.getBoundingRectangle();

    return (
      <AnnotationBounds
          category={question_type}
          onClick={this.onClick}
          x1={bounds.left}
          y1={bounds.top}
          x2={bounds.right}
          y2={bounds.bottom} />
    );
  }
}

module.exports = TextAnnotationComponent;
