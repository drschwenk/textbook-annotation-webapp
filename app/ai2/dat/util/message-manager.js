'use strict';

const EventEmitter = require('./event-emitter');
const MessageType = require('./message-type');
const MessageManagerEvent = require('./message-manager-event');

class Message {
  constructor(type, text) {
    this.type = type;
    this.text = text;
  }
}

class MessageManager extends EventEmitter {
  constructor() {
    super();
  }
  addMessage(type, text) {
    this.emit(MessageManagerEvent.NEW_MESSAGE, new Message(type, text));
    return this;
  }
  error(text) {
    return this.addMessage(MessageType.ERROR, text);
  }
  warn(text) {
    return this.addMessage(MessageType.WARNING, text);
  }
  success(text) {
    return this.addMessage(MessageType.SUCCESS, text);
  }
}

module.exports = new MessageManager();