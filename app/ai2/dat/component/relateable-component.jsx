'use strict';

const React = require('react');

const AnnotationEvent = require('../model/annotation-event');
const AnnotationClickManager = require('../model/annotation-click-manager');
const RelationshipLabel = require('./relationship-label.jsx');

class RelateableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isRelated: this.props.annotation.relationships.size > 0 };

    this.onClick = this.onClick.bind(this);
    this.toggleRelationshipState = this.toggleRelationshipState.bind(this);

    this.props.annotation.on(
      [
        AnnotationEvent.RELATIONSHIP_ADDED,
        AnnotationEvent.RELATIONSHIP_REMOVED
      ],
      this.toggleRelationshipState
    );
  }
  componentWillUnmount() {
    this.props.annotation.off(
      [
        AnnotationEvent.RELATIONSHIP_ADDED,
        AnnotationEvent.RELATIONSHIP_REMOVED
      ],
      this.toggleRelationshipState
    );
  }
  toggleRelationshipState() {
    this.setState({
      isRelated: this.props.annotation.relationships.size > 0
    });
  }
  onClick() {
    AnnotationClickManager.clicked(this.props.annotation);
  }
  getRelatedCssClass() {
    var cssClass;
    if (this.state.isRelated) {
      cssClass = 'related';
    }
    return cssClass;
  }
  renderRelationshipLabels() {
    var labels = [];
    if (this.state.isRelated) {
      this.props.annotation.relationships.forEach(function(r) {
        labels.push(
          <li key={r.id}><RelationshipLabel relationship={r} /></li>
        );
      });
      if (labels.length > 0) {
        labels = <ul className="relationship-label-list">{labels}</ul>;
      }
    }
    return labels;
  }
}

module.exports = RelateableComponent;