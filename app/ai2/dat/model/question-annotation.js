'use strict';

var Annotation = require('./annotation');
var AnnotationType = require('./annotation-type');
var TextAnnotation = require('./text-annoation')

class QuestionAnnotation extends TextAnnotation {
  constructor(id, bounds, text, category, group_n) {
    super(id, AnnotationType.TEXT, bounds, text, category);
    this.group_n = group_n;
  }
}

module.exports = TextAnnotation;
