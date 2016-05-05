'use strict';

const AnnotationMode = {
  ARROWS: 'arrows',
  SHAPES: 'shapes',
  RELATIONSHIPS: 'relationships',
  CONTAINERS: 'containers',
  ARROW_LABELS: 'arrow labels',
  TEXT: 'text'
};

AnnotationMode.default = function() {
  return AnnotationMode.ARROWS;
};

AnnotationMode.all = function() {
  return Object.getOwnPropertyNames(this).filter(function(m) {
    return typeof AnnotationMode[m] !== 'function';
  }).map(function(m) {
    return AnnotationMode[m];
  });
};

AnnotationMode.toString = function(mode) {
  return typeof mode === 'string' ? mode.substr(0,1).toUpperCase() + mode.substr(1) : '';
};

Object.freeze(AnnotationMode);

module.exports = AnnotationMode;
