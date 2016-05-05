'use strict';

const Annotation = require('./annotation');
const AnnotationType = require('./annotation-type');

class ContainerAnnotation extends Annotation {
  constructor(id, bounds) {
    super(id, AnnotationType.CONTAINER);
    this.bounds = bounds;
  }
}

module.exports = ContainerAnnotation;
