'use strict';

var Annotation = require('./annotation');
var AnnotationType = require('./annotation-type');

class ArrowAnnotation extends Annotation {
  constructor(id, origins, destinations) {
    super(id, AnnotationType.ARROW);
    this.origins = new Map();
    this.destinations = new Map();
    if (Array.isArray(origins)) {
      origins.forEach(this.addOrigin.bind(this));
    }
    if (Array.isArray(destinations)) {
      destinations.forEach(this.addDestination.bind(this));  
    }
  }
  removeOrigin(id) {
    this.origins.delete(id);
    return this;
  }
  addOrigin(origin) {
    this.origins.set(origin.id, origin);
    return this;
  }
  removeDestination(id) {
    this.destinations.delete(id);
    return this;
  }
  addDestination(dest) {
    this.destinations.set(dest.id, dest);
    return this;
  }
  isValid() {
    return this.origins.size > 0 && this.destinations.size > 0;
  }
  allPointIds() {
    var allIds = [];
    var addId = function(point, id) {
      allIds.push(id);
    };
    this.origins.forEach(addId);
    this.destinations.forEach(addId);
    return allIds;
  }
  getNextOriginId() {
    return [
      this.id,
      'O',
      this.origins.size + 1
    ].join('');
  }
  getNextDestinationId() {
    return [
      this.id,
      'D',
      this.destinations.size + 1
    ].join('');
  }
  export() {
    var out = super.export();

    // We need to export the origins and destinations manually since the Map type doesn't
    // serialize sensibly right now via JSON.stringify.
    var origins = [];
    this.origins.forEach(function(point) {
      origins.push(point);
    });
    out.origins = origins;

    var destinations = [];
    this.destinations.forEach(function(point) {
      destinations.push(point);
    });
    out.destinations = destinations;

    return out;
  }
}

module.exports = ArrowAnnotation;