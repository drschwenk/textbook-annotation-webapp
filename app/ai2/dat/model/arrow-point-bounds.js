'use strict';

var Bounds = require('./bounds');

class ArrowPointBounds extends Bounds {
  constructor(id, rotation, ...coords) {
    super(coords);
    this.id = id;
    this.rotation = isNaN(rotation) ? 0 : rotation;
  }
}

module.exports = ArrowPointBounds;
