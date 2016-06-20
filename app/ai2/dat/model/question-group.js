'use strict';

const Annotation = require('./annotation');
const AnnotationType = require('./annotation-type');

class QuestionGroup extends Annotation {
  constructor(id, question_type) {
    super(id, AnnotationType.TEXT);
    this.constituents= new Set();
    this.question_type = question_type;
  }

  setConsituent(question_box) {
    if (question_box) {
      if (this.isRelated(id)) {
        throw 'Question' + question_box.box_id + ' is already in a group' + question_box.box_id;
      }
      this.constituents.add(question_box);
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
module.exports = QuestionGroup;
