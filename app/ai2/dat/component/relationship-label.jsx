'use strict';

const React = require('react');

const reNonDigit = /\D/g;

class RelationshipLabel extends React.Component {
  render() {
    var digit = this.props.relationship.id.replace(reNonDigit, '');
    return <label className="relationship-label">R{digit}</label>;
  }
}

module.exports = RelationshipLabel;