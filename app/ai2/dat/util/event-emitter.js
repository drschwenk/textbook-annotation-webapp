'use strict';

class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(event, fn) {
    if (Array.isArray(event)) {
      event.forEach(function(e) {
        this.on(e, fn);
      }.bind(this));
    } else {
      if (typeof fn === 'function') {
        if (!this.listeners[event]) {
          this.listeners[event] = new Set();
        }
        this.listeners[event].add(fn);
      }
    }
    return this;
  }
  off(event, fn) {
    if (Array.isArray(event)) {
      event.forEach(function(e) {
        this.off(e, fn);
      }.bind(this));
    } else {
      if (this.listeners[event]) {
        this.listeners[event].delete(fn);
      }
    }
    return this;
  }
  emit(event, ...args) {
    var params = args.slice();
    params.unshift(event);
    if (this.listeners[event]) {
      this.listeners[event].forEach(function(fn) {
        fn(...params);
      });
    }
    return this;
  }
  removeAllListeners() {
    this.listeners = {};
  }
}

module.exports = EventEmitter;