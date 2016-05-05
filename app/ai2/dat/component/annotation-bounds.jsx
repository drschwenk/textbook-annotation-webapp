'use strict';

const React = require('react');

class AnnotationBounds extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const width = this.props.x2 - this.props.x1;
    const height = this.props.y2 - this.props.y1;

    // applying the rule that annotations with a greater area
    // should have a lower z-index, this continues to allow
    // annotations to be selected if a larger boundary box is
    // created over a smaller one. Using 2^24 as the upper bound
    // assuming we won't have boundary boxes larger than 4096x4096
    var zIndex = Math.round(Math.pow(2, 24)/(width * height));
    var style = {
      left: this.props.x1 + 'px',
      top: this.props.y1 + 'px',
      width: width + 'px',
      height: height + 'px',
      zIndex: zIndex
    };

    var label;
    if (this.props.label) {
      label = <label className="shape-id-label">{this.props.label}</label>;
    }
    if (this.props.arrowLabel) {
      label = <label className="shape-id-label arrow-label">{this.props.arrowLabel}</label>;
    }
    if (this.props.shapeLabel) {
      label = <label className="shape-id-label shape-label">{this.props.shapeLabel}</label>;
    }
    if (this.props.relationLabel) {
      label = <label className="shape-id-label relation-label">{this.props.relationLabel}</label>;
    }
    if (this.props.containerLabel) {
      label = <label className="shape-id-label container-label">{this.props.containerLabel}</label>;
    }
    if (this.props.textLabel) {
      label = <label className="shape-id-label text-label">{this.props.textLabel}</label>;
    }

    var cssClass = 'annotation-bounds';
    if (this.props.className) {
      cssClass += ' ' + this.props.className;
    }

    return (
      <div className={cssClass}
          onClick={this.props.onClick}
          style={style}>
        {label}
        {this.props.relationshipLabels}
        {this.props.overlay}
      </div>
    );
  }
}

module.exports = AnnotationBounds;
