'use strict';

const SettingsManagerEvent = {
  SETTING_CHANGED: 'setting-changed',
  SETTING_DELETED: 'setting-deleted'
};
Object.freeze(SettingsManagerEvent);

module.exports = SettingsManagerEvent;