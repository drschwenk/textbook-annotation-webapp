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
          category={'Header/Topic'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'1'}
          />;
        var discussion_button = <CategoryButton
          category={'Discussion'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'2'}
          />;
        var question_button = <CategoryButton
          category={'Question'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'4'}
          />;
        var answer_button = <CategoryButton
          category={'Answer'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'5'}
          />;
        var label_button = <CategoryButton
          category={'Figure Label'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'6'}
          />;
        var unlabeled_button = <CategoryButton
          category={'unlabeled'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'7'}
          />;
        var defintion_button = <CategoryButton
          category={'Definition'}
          current_category={this.state.current_category}
          onClickEvent={this.handleClickEvent}
          hotKeyNumber={'3'}
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
              {defintion_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {question_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {answer_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {label_button}
            </div>
            <div className="annotation-pane-dialog-content">
              {unlabeled_button}
            </div>
          </div>
    );
    }
}

module.exports = CategorySelector;
