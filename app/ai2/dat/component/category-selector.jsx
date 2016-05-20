'use strict';

const React = require('react');

const AnnotationManager = require('../model/annotation-manager');

class CategorySelector extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClickEvent(selected_category){
        AnnotationManager.setCurrentCategory(selected_category);
        // console.log(AnnotationManager.getCurrentCategory());
    }

    render() {
        return (
            <div className="annotation-pane-dialog-header">
                <span>Select Category</span>
                <div className="annotation-pane-dialog-content">
                    <button onClick={this.handleClickEvent.bind(null, "Header/Topic")} className="btn-dark-blue">Header/Topic</button>
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
                    <button onClick={this.handleClickEvent.bind(null, "Other")} className="btn-gray">Other</button>
                </div>
                <hr> </hr>
                <hr> </hr>
                <div className="annotation-pane-dialog-content">
                    <button onClick={this.saveAndAdvance} className="btn-green">Submit Results</button>
                </div>
            </div>
    );
    }
}

module.exports = CategorySelector;
