'use strict';

/* global FileReader */
const hasFileReaderAPI = FileReader ? true : false;

module.exports = {
  isSupported: hasFileReaderAPI,
  read: function(file) {
    return new Promise(function(resolve, reject) {
      if (hasFileReaderAPI) {
        var reader = new FileReader();
        reader.onload = function(event) {
          resolve(event.target.result);
        };
        reader.onerror = function(event) {
          reject(event);
        };
        // TODO (codeviking): Expand mime-type to type support more types
        if (file) {
          if (file.type.indexOf('image') !== -1) {
            reader.readAsDataURL(file);
          } else if (file.type === 'application/json') {
            reader.readAsText(file);
          } else {
            throw 'Unsupported file type "' + file.type + '"';
          }
        } else {
          throw 'Invalid file';
        }
      } else {
        reject('Not supported');
      }
    });
  }
};