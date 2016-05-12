'use strict';

var Annotation = require('./annotation');
var AnnotationType = require('./annotation-type');

class TextAnnotation extends Annotation {
  constructor(id, bounds, text, category) {
    super(id, AnnotationType.TEXT);
    this.bounds = bounds;
    this.text = text;
    this.category = category;
  }
}

module.exports = TextAnnotation;