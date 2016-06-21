'use strict';

const React = require('react');

const AnnotationBounds = require('./annotation-bounds.jsx');
const RelateableComponent = require('./relateable-component.jsx');

class TextAnnotationComponent extends RelateableComponent {
  constructor(props) {
    super(props);
  }
  render() {
    // var label = this.props.annotation.id;
    var label = null
    var category = this.props.annotation.category;
    var group_n = this.props.annotation.group_n;
    // if (this.props.annotation.text) {
    //   label += ': \u201C' + this.props.annotation.text + '\u201D';
    // }
    const cssClass = this.getRelatedCssClass();
    const relationshipLabels = this.renderRelationshipLabels();
    // console.log(relationshipLabels);
    const bounds = this.props.annotation.bounds.getBoundingRectangle();
    //          className={cssClass}
    //          relationshipLabels={relationshipLabels}

    return (
      <AnnotationBounds
          textLabel={label}
          category={category}
          group_n={group_n}
          onClick={this.onClick}
          x1={bounds.left}
          y1={bounds.top}
          x2={bounds.right}
          y2={bounds.bottom} />
    );
  }
}

module.exports = TextAnnotationComponent;
