'use strict';

class KeyMaster {
  constructor() {
    this.mappings = new Map();
    this.mounted = false;
    this.mount();
  }
  keydown(event) {
    if (this.mappings.has(event.keyCode)) {
      this.mappings.get(event.keyCode)(event);
    }
  }
  mount() {
    if (!this.mounted) {
      this.mounted = true;
      this.keydown = this.keydown.bind(this);
      window.addEventListener('keydown', this.keydown);
    }
    return this;
  }
  unmount() {
    if (this.mounted) {
      window.removeEventListener('keydown', this.keydown);
    }
    return this;
  }
  on(keycode, fn) {
    if (this.mappings.has(keycode)) {
      throw keycode + 'already bound.';
    } else {
      this.mappings.set(keycode, fn);
    }
    return this;
  }
  off(keycode) {
    this.mappings.delete(keycode);
    return this;
  }
}

module.exports = new KeyMaster();