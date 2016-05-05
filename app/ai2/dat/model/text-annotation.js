'use strict';

var Annotation = require('./annotation');
var AnnotationType = require('./annotation-type');

class TextAnnotation extends Annotation {
  constructor(id, bounds, text) {
    super(id, AnnotationType.TEXT);
    this.bounds = bounds;
    this.text = text;
  }
}

module.exports = TextAnnotation;