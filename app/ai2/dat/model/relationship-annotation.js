'use strict';

const Annotation = require('./annotation');
const AnnotationType = require('./annotation-type');

class RelationshipAnnotation extends Annotation {
  constructor(id, sourceId, targetId, arrowOriginId, arrowDestId) {
    super(id, AnnotationType.RELATIONSHIP);
    this.relatedIds = new Set();
    this.setSourceId(sourceId)
      .setTargetId(targetId)
      .setArrowOriginId(arrowOriginId)
      .setArrowDestinationId(arrowDestId);
  }
  setSourceId(id) {
    if (id) {
      if (this.isRelated(id)) {
        throw 'Annotation ' + id + ' is already involved in relationship ' + this.id;
      }
      this.relatedIds.add(id);
    }
    if (this.source) {
      this.relatedIds.delete(this.source);
    }
    this.source = id;
    return this;
  }
  removeSourceId() {
    return this.setSourceId();
  }
  setArrowOriginId(id, remoteId) {
    if (id) {
      if (this.isRelated(id)) {
        throw 'Annotation ' + id + ' is already involved in relationship ' + this.id;
      }
      this.relatedIds.add(id);
    }
    if (this.arrowOrigin) {
      this.relatedIds.delete(this.arrowOrigin);
    }
    this.arrowOrigin = id;
    this.arrowOriginRemoteId = remoteId;
    return this;
  }
  removeOriginId() {
    return this.setArrowOriginId();
  }
  setArrowDestinationId(id, remoteId) {
    if (id) {
      if (this.isRelated(id)) {
        throw 'Annotation ' + id + ' is already involved in relationship ' + this.id;
      }
      this.relatedIds.add(id);
    }
    if (this.arrowDestination) {
      this.relatedIds.delete(this.arrowDestination);
    }
    this.arrowDestination = id;
    this.arrowDestinationRemoteId = remoteId;
    return this;
  }
  removeDestinationId() {
    return this.setArrowDestinationId();
  }
  setTargetId(id) {
    if (id) {
      if (this.isRelated(id)) {
        throw 'Annotation ' + id + ' is already involved in relationship ' + this.id;
      }
      this.relatedIds.add(id);
    }
    if (this.target) {
      this.relatedIds.delete(this.target);
    }
    this.target = id;
    return this;
  }
  removeTargetId() {
    return this.setTargetId();
  }
  isRelated(id) {
    return this.relatedIds.has(id);
  }
}

module.exports = RelationshipAnnotation;
