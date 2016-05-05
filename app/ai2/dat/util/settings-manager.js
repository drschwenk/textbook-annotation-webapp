'use strict';

const EventEmitter = require('./event-emitter');
const Setting = require('./setting');
const SettingsManagerEvent = require('./settings-manager-event');

/**
 * Manager for application settings which are toggle-able by the user.
 */
class SettingsManager extends EventEmitter {
  constructor() {
    super();
    this.settings = new Map();

    // default settings
    this.set(Setting.SHOW_LABELS, true);

  }
  get(key) {
    return this.settings.get(key);
  }

  set(key, value) {
      if (key === Setting.SHOW_LABELS) {
        this.setAllAs(value);
        this.settings.set(Setting.SHOW_LABELS, value);
      } else {
        this.settings.set(key, value);
        var allOnBefore = this.settings.get(Setting.SHOW_LABELS);
        var allOn = this.settings.get(Setting.SHOW_ARROW_LABELS) &&
            this.settings.get(Setting.SHOW_SHAPE_LABELS) &&
            this.settings.get(Setting.SHOW_RELATION_LABELS) &&
            this.settings.get(Setting.SHOW_CONTAINER_LABELS) &&
            this.settings.get(Setting.SHOW_TEXT_LABELS);
            this.settings.set(Setting.SHOW_LABELS, allOn);
        if ((allOn || allOnBefore) && !(allOn && allOnBefore)) {
          this.emit(SettingsManagerEvent.SETTING_CHANGED, Setting.SHOW_LABELS, allOn);
        }
        this.emit(SettingsManagerEvent.SETTING_CHANGED, key, value);
      }
  }

  setAllAs(value) {
    this.set(Setting.SHOW_ARROW_LABELS, value);
    this.set(Setting.SHOW_SHAPE_LABELS, value);
    this.set(Setting.SHOW_RELATION_LABELS, value);
    this.set(Setting.SHOW_CONTAINER_LABELS, value);
    this.set(Setting.SHOW_TEXT_LABELS, value);
  }

  delete(key) {
    this.settings.delete(key);
    this.emit(SettingsManagerEvent.SETTING_DELETED, key);
  }
}

module.exports = new SettingsManager();
