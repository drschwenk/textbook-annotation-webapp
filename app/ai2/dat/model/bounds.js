'use strict';

class Bounds {
  constructor(...coords) {
    // Support coordinates being passed in as an array.  ArrowPointBounds does this, and
    // something is broken with calls to super with the spread operator...
    if (coords.length === 1 && Array.isArray(coords[0])) {
      coords = coords[0];
    }
    this.coords = coords;
    if (this.coords.length !== 2) {
      throw 'Invalid Bounds';
    }
  }

  distance(bounds) {
    var xdiff = bounds.centerPoint().x - this.centerPoint().x;
    var ydiff = bounds.centerPoint().y - this.centerPoint().y;
    return Math.sqrt(Math.pow(xdiff, 2) + Math.pow(ydiff, 2));
  }

  centerPoint() {
    var centerX =  this.coords[0].x + (this.coords[1].x - this.coords[0].x)/2;
    var centerY =  this.coords[0].y + (this.coords[1].y - this.coords[0].y)/2;
    return {x: centerX, y: centerY};
  }

  getBoundingRectangle() {
    var width = this.coords[1].x - this.coords[0].x;
    var height = this.coords[1].y - this.coords[0].y;
    return {
      top: this.coords[0].y,
      left: this.coords[0].x,
      right: this.coords[1].x,
      bottom: this.coords[1].y,
      width: width,
      height: height
    };
  }
}

module.exports = Bounds;
