'use strict';

const React = require('react');

const AnnotationManager = require('../model/annotation-manager');
const ImageManager = require('../model/image-manager');
const Radium = require('radium');
const color = require('color');


class CategoryButton extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
      var color_map = new Object();
      color_map["Short Answer"] = "#e7d323";
      color_map["Fill-in-the-Blank"] = "#286a8e";
      color_map["True/False"] = "#3fb62c";
      color_map["Unlabeled"] = "#e77423";
      color_map["Multiple Choice"] = "#BA70CC";

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
      var styles = {
            selected: {
                background: convertHex(get_rgb_value(this.props.category), 0.85),
                border: "4px solid #1E1E1E"
            },
            not_selected: {
                background: convertHex(get_rgb_value(this.props.category), 0.85),
            }
        };
        if (this.props.category === AnnotationManager.getCurrentCategory()){
          var style = styles.selected;
        } else {
          var style = styles.not_selected;
        };
        var this_button = this;
        return (
          <button kind="primary" style={style}
            onClick={this_button.props.onClickEvent.bind(null, this.props.category)}
            >{this.props.hotKeyNumber + ")      " + this.props.category}</button>
    );
    }
}

module.exports = Radium(CategoryButton);
