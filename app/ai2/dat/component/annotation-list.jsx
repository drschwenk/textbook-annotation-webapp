'use strict';

const React = require('react');
const AnnotationManager = require('../model/annotation-manager');
const ImageManager = require('../model/image-manager');

class AnnotationList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var annotationList = [];
    this.props.annotations.forEach(function(a, i) {
      var type = a.type.toUpperCase();
      var removeAnnotation = function(event) {
        AnnotationManager.removeAnnotation(ImageManager.getCurrentImageId(), a.id);
        event.stopPropagation();
      };
      annotationList.push(
        <li key={i} className="flex-row">
          <span className="annotation-list-id">
            <strong>{type}:</strong>
            {a.id}
          </span>
          <button className="btn-sm btn-red flex-align-right"
              onClick={removeAnnotation}>Remove</button>
        </li>
      );
    }.bind(this));
    if (annotationList.length === 0) {
      annotationList.push(<li key="empty" className="empty">(none)</li>);
    }
    return (
      <span className="annotation-list">
        <span className="arrow-up"></span>
        <ul>{annotationList}</ul>
      </span>
    );
  }
}

module.exports = AnnotationList;
