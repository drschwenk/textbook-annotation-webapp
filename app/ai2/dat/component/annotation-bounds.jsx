'use strict';

const React = require('react');
const Radium = require('radium');

const AnnotationManager = require('../model/annotation-manager')

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

    var color_map = new Object();
    color_map["Header/Topic"] = "#8c9296";
    color_map["Discussion"] = "#8c9296";
    color_map["Definition"] = "#8c9296";
    color_map["Question"] = "#e77423";
    color_map["Answer"] = "#8c9296";
    color_map["unlabeled"] = "#8c9296";
    color_map["Figure Label"] = "#8c9296";
    color_map["Short Answer"] = "#e7d323";
    color_map["Fill-in-the-Blank"] = "#286a8e";
    color_map["True/False"] = "#3fb62c";
    color_map["Multiple Choice"] = "#BA70CC";
    color_map["Unlabeled"] = "#e77423";

    color_map["No Consensus"] = "#8c9296";

    function get_rgb_value(k) {
      return color_map[k];
    }
    function convertHex(hex_color, opacity){
      var hex_color = hex_color.replace('#','');
      var red = parseInt(hex_color.substring(0,2), 16);
      var green = parseInt(hex_color.substring(2,4), 16);
      var blue = parseInt(hex_color.substring(4,6), 16);

    var color_with_trans = 'rgba('+red+','+green+','+blue+','+opacity+')';
      return color_with_trans;
    }
    if(this.props.group_n > 0 && this.props.group_n < AnnotationManager.getCurrentGroupNumber()){
      var box_opacity = 0.8
    }
    else{
      var box_opacity = 0.3
    }
    var styles = {
          base: {
            left: this.props.x1 + 'px',
            top: this.props.y1 + 'px',
            width: width + 'px',
            height: height + 'px',
            zIndex: zIndex,
            backgroundColor: convertHex(get_rgb_value(this.props.category), box_opacity),
            ':hover': {
              border: "8px dotted " + convertHex(get_rgb_value(AnnotationManager.getCurrentCategory()), 0.8)
            }
          }
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
          style={[styles.base, styles[this.props.kind]]}>
        {label}
        {this.props.relationshipLabels}
        {this.props.overlay}
      </div>
    );
  }
}

module.exports = Radium(AnnotationBounds);
