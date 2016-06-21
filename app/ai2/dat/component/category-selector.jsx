'use strict';

const React = require('react');

const AnnotationManager = require('../model/annotation-manager');
const ImageManager = require('../model/image-manager');
const Radium = require('radium');
const CategoryButton = require('./category-button.jsx');

class CategorySelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {current_category: AnnotationManager.getCurrentCategory()}
        this.handleClickEvent = this.handleClickEvent.bind(this);
    }

    handleClickEvent(selected_category){
        AnnotationManager.setCurrentCategory(selected_category);
    }
    hotKeyPressed(keyed_category){
      this.handleClickEvent(keyed_category);
    }
    handleClickEvent(selected_category){
        AnnotationManager.setCurrentCategory(selected_category);
        this.setState({current_category: selected_category});
    }
    render() {
        var header_button = <CategoryButton
          category={'Short Answer'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'1'}
          />;
        var discussion_button = <CategoryButton
          category={'Fill-in-the-Blank'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'2'}
          />;
        var question_button = <CategoryButton
          category={'True/False'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'3'}
          />;
        var label_button = <CategoryButton
          category={'Multiple Choice'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'4'}
          />;
        var answer_button = <CategoryButton
          category={'Unlabeled'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'5'}
          />;
        return (
        <div className="annotation-pane-dialog-header">
            <span>Select Category</span>
            <div className="annotation-pane-dialog-content">
              {header_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {discussion_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {question_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {label_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {answer_button}
            </div>
          </div>
    );
    }
}

module.exports = CategorySelector;
