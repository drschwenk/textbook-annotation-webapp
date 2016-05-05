'use strict';

const EventEmitter = require('../util/event-emitter');
const AnnotationEvent = require('./annotation-event');

class Annotation extends EventEmitter {
  constructor(id, type) {
    super();
    this.id = id;
    this.type = type;
    this.relationships = new Set();
  }
  addRelationship(relationship) {
    this.relationships.add(relationship);
    this.emit(AnnotationEvent.RELATIONSHIP_ADDED, this.relationships);
    return this;
  }
  isRelated(id) {
    return this.related(id).length > 0;
  }
  related(id) {
    var related = [];
    this.relationships.forEach(function(relationship) {
      if (relationship.isRelated(id)) {
        related.push(relationship);
      }
    });
    return related;
  }
  removeRelationship(relationship) {
    this.relationships.delete(relationship);
    this.emit(AnnotationEvent.RELATIONSHIP_REMOVED, this.relationships);
    return this;
  }
}

module.exports = Annotation;
