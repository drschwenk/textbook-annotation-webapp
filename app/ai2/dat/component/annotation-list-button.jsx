'use strict';

const React = require('react');

const AnnotationList = require('./annotation-list.jsx');

class AnnotationListButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showList: false };
    this.toggleListVisibility = this.toggleListVisibility.bind(this);
  }
  toggleListVisibility() {
    this.setState({ showList: !this.state.showList });
  }
  render() {
    var list;
    var cssClass = 'annotation-count';
    if (this.state.showList) {
      cssClass += ' list-visible';
      list = <AnnotationList annotations={this.props.annotations} />;
    }
    return (
      <span onClick={this.toggleListVisibility} className={cssClass}>
        {this.props.annotations.size}
        {list}
      </span>
    );
  }
}

module.exports = AnnotationListButton;