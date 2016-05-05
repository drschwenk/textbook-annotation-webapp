'use strict';

const React = require('react');
const AnnotationMode = require('../model/annotation-mode');
const AnnotationManager = require('../model/annotation-manager');
const AnnotationManagerEvent = require('../model/annotation-manager-event');

class AnnotationModeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedMode: AnnotationManager.getMode() };
    this.updateSelectedMode = this.updateSelectedMode.bind(this);
    this.setMode = this.setMode.bind(this);
  }
  updateSelectedMode() {
    this.setState({
      selectedMode: AnnotationManager.getMode()
    });
  }
  componentDidMount() {
    AnnotationManager.on(AnnotationManagerEvent.MODE_CHANGED, this.updateSelectedMode);
  }
  componentWillUnmout() {
    AnnotationManager.off(AnnotationManagerEvent.MODE_CHANGED, this.updateSelectedMode);
  }
  setMode(event) {
    AnnotationManager.setMode(event.target.value);
  }
  render() {
    var options = AnnotationMode.all().map(function(m, index) {
      var text = AnnotationMode.toString(m);
      return <option key={index} value={m}>{text}</option>;
    }.bind(this));
    return (
      <select onChange={this.setMode}
          value={this.state.selectedMode}
          className="annotation-mode-selector">{options}</select>
    );
  }
}

module.exports = AnnotationModeSelector;