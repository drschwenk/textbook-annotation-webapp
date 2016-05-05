'use strict';

const Annotation = require('./annotation');
const AnnotationType = require('./annotation-type');

class ShapeAnnotation extends Annotation {
  constructor(id, bounds, text) {
    super(id, AnnotationType.SHAPE);
    this.bounds = bounds;
    this.text = text;
  }
}

module.exports = ShapeAnnotation;
