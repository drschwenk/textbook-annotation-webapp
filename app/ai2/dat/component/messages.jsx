'use strict';

const React = require('react');

const MessageManager = require('../util/message-manager');
const MessageManagerEvent = require('../util/message-manager-event');

/**
 * @private
 * Determine the appropriate, prefixed event name for the animationend event.
 */
const animationEndEventName = (function() {
  const prefixes = [ 'webkit', 'ms', 'moz', 'o' ];
  var eventName = 'AnimationEnd';
  var style = 'animation';
  if (style in document.body.style) {
    eventName = eventName.toLowerCase();
  } else {
    // Capitalize the first letter, since prefixed versions are camel-cased, i.e. webkitAnimation
    style = style.substr(0, 1).toUpperCase() + style.substr(1);
    prefixes.some(function(prefix) {
      var prefixedStyle = prefix + style;
      if (prefixedStyle in document.body.style) {
        eventName = prefix + eventName;
        return true;
      }
    });
  }
  return eventName;
}());

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visibleMessages: [], messagesToHide: [] };
    this.messages = [];
    this.animationHandlers = new Map();
    this.addNewMessage = this.addNewMessage.bind(this);
    MessageManager.on(MessageManagerEvent.NEW_MESSAGE, this.addNewMessage);
  }
  componentWillUnmount() {
    MessageManager.off(MessageManagerEvent.NEW_MESSAGE, this.addNewMessage);
    this.removeAllTimeouts();
    this.animationhandlers.forEach(function(handler, node) {
      this.animationHandlers.delete(node);
      node.removeEventListener(animationEndEventName, handler);
    }.bind(this));
  }
  componentDidUpdate() {
    this.state.visibleMessages.forEach(function(msg) {
      var id = 'msg-' + msg.uniqueId;
      var node = React.findDOMNode(this.refs[id]);
      if (node && !this.animationHandlers.has(node)) {
        this.animationHandlers.set(node, function() {
          this.animationHandlers.delete(node);
          this.hideMessage(msg);
        }.bind(this));
        node.addEventListener(animationEndEventName, this.animationHandlers.get(node));
      }
    }.bind(this));
  }
  removeAllTimeouts() {
    this.timeouts.forEach(clearTimeout);
    return this;
  }
  addNewMessage(event, msg) {
    msg.uniqueId = Date.now() * Math.random();
    this.messages.push(msg);
    this.displayQueuedMessages();
  }
  displayQueuedMessages() {
    const max = this.props.max || 4;
    const free = max - this.state.visibleMessages.length;

    if (free > 0 && this.messages.length > 0) {
      const newMessages = this.messages.splice(0, free);
      this.setState({
        visibleMessages: this.state.visibleMessages.concat(newMessages)
      });
    }
  }
  hideMessage(message) {
    // Mark the message as hidden
    message.hidden = true;

    // If there's visible messages after the one which just became invisible, don't remove it
    // yet.  This will cause the message to jump up (as the <li> preceeding it has been removed).
    // Instead we only remove hidden messages from the end of the list of displayed messages.
    var visible = this.state.visibleMessages.slice();
    var idx = visible.length - 1;
    while (idx > -1 && visible[idx].hidden) {
      visible.pop();
      idx--;
    }
    this.setState({
      visibleMessages: visible
    });

    // Kick off displaying more messages (if they're queued up);
    this.displayQueuedMessages();
  }
  render() {
    var messages = this.state.visibleMessages.map(function(msg) {
      var cssClass = 'msg msg-' + msg.type;
      var id = 'msg-' + msg.uniqueId;
      return <li className={cssClass} key={id} ref={id}>{msg.text}</li>;
    }.bind(this));
    return <ul className="msg-list">{messages}</ul>;
  }
}

module.exports = Messages;