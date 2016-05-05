'use strict';

const EventEmitter = require('../util/event-emitter');
const AnnotationClickEvent = require('./annotation-click-event');

class AnnotationClickManager extends EventEmitter {
  constructor() {
    super();
    this.active = false;
  }
  activate() {
    this.active = true;
    return this;
  }
  deactivate() {
    this.active = false;
    return this.removeAllListeners();
  }
  clicked(annotation, arrowPoint, arrowPointType) {
    if (typeof annotation === 'function') {
      this.on(AnnotationClickEvent.CLICKED, annotation);
    } else if(annotation && this.active) {
      this.emit(AnnotationClickEvent.CLICKED, annotation, arrowPoint, arrowPointType);
    }
    return this;
  }
}

module.exports = new AnnotationClickManager();