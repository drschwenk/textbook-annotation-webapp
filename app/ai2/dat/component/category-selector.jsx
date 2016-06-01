'use strict';

const React = require('react');

const AnnotationManager = require('../model/annotation-manager');
const ImageManager = require('../model/image-manager');
const Radium = require('radium');
const color = require('color');


class CategorySelector extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClickEvent(selected_category){
        AnnotationManager.setCurrentCategory(selected_category);
    }


    render() {
      var styles = {
            base: {
              color: '#fff',

              // Adding interactive state couldn't be easier! Add a special key to your
              // style object (:hover, :focus, :active, or @media) with the additional rules.
              ':hover': {
                border: "5px solid"
                // background: color('#0074d9').lighten(0.2).hexString()
              }
            }
        };
        return (
        <div className="annotation-pane-dialog-header">
            <span>Select Category</span>
            <div className="annotation-pane-dialog-content">
                <button style={[styles.base, styles[this.props.kind]]} onClick={this.handleClickEvent.bind(null, "Header/Topic")} className="btn-dark-blue">Header/Topic</button>
            </div>
            <div className="annotation-pane-dialog-content">
                <button onClick={this.handleClickEvent.bind(null, "Discussion")} className="btn-blue">Discussion</button>
            </div>
            <div className="annotation-pane-dialog-content">
                <button onClick={this.handleClickEvent.bind(null, "Definition")} className="btn-green">Definition</button>
            </div>
            <div className="annotation-pane-dialog-content">
                <button onClick={this.handleClickEvent.bind(null, "Question")} className="btn-red">Question</button>
            </div>
            <div className="annotation-pane-dialog-content">
                <button onClick={this.handleClickEvent.bind(null, "Answer")} className="btn-yellow">Answer</button>
            </div>
            <div className="annotation-pane-dialog-content">
                <button onClick={this.handleClickEvent.bind(null, "Figure Label")} className="btn-orange">Figure Label</button>
            </div>
            <div className="annotation-pane-dialog-content">
                <button onClick={this.handleClickEvent.bind(null, "unlabeled")} className="btn-gray">Unlabeled</button>
            </div>
        </div>
    );
    }
}

module.exports = Radium(CategorySelector);
