'use strict';

const React = require('react');

const ArrowPoint = require('./arrow-point.jsx');

class ArrowAnnotationComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var bounds = [];

    this.props.annotation.origins.forEach(function(point) {
      bounds.push(
        <ArrowPoint key={point.id}
            point={point}
            type="origin"
            annotation={this.props.annotation} />
      );
    }.bind(this));

    this.props.annotation.destinations.forEach(function(point) {
      bounds.push(
        <ArrowPoint key={point.id}
          point={point}
          type="destination"
          annotation={this.props.annotation} />
      );
    }.bind(this));

    return (
      <div>
        {bounds}
      </div>
    );
  }
}

module.exports = ArrowAnnotationComponent;