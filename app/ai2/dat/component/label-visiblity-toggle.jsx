'use strict';

const React = require('react');

const Setting = require('../util/setting');
const SettingsManagerEvent = require('../util/settings-manager-event');
const SettingsManager = require('../util/settings-manager');

class LabelVisiblityToggle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedAll: SettingsManager.get(Setting.SHOW_LABELS),
      checkedArrows: SettingsManager.get(Setting.SHOW_ARROW_LABELS),
      checkedShapes: SettingsManager.get(Setting.SHOW_SHAPE_LABELS),
      checkedRelations: SettingsManager.get(Setting.SHOW_RELATION_LABELS),
      checkedContainers: SettingsManager.get(Setting.SHOW_CONTAINER_LABELS),
      checkedText: SettingsManager.get(Setting.SHOW_TEXT_LABELS)
    };
    //this.toggleVisbility = this.toggleVisbility.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.toggleArrows = this.toggleVisbility.bind(this, Setting.SHOW_ARROW_LABELS);
    this.toggleShapes = this.toggleVisbility.bind(this, Setting.SHOW_SHAPE_LABELS);
    this.toggleRelations = this.toggleVisbility.bind(this, Setting.SHOW_RELATION_LABELS);
    this.toggleContainers = this.toggleVisbility.bind(this, Setting.SHOW_CONTAINER_LABELS);
    this.toggleText = this.toggleVisbility.bind(this, Setting.SHOW_TEXT_LABELS);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    SettingsManager.on(SettingsManagerEvent.SETTING_CHANGED, this.update);
  }
  componentWillUnmount() {
    SettingsManager.off(SettingsManagerEvent.SETTING_CHANGED, this.update);
  }
  update() {
    this.setState({
      checkedAll: SettingsManager.get(Setting.SHOW_LABELS),
      checkedArrows: SettingsManager.get(Setting.SHOW_ARROW_LABELS),
      checkedShapes: SettingsManager.get(Setting.SHOW_SHAPE_LABELS),
      checkedRelations: SettingsManager.get(Setting.SHOW_RELATION_LABELS),
      checkedContainers: SettingsManager.get(Setting.SHOW_CONTAINER_LABELS),
      checkedText: SettingsManager.get(Setting.SHOW_TEXT_LABELS)});
  }
  toggleVisbility(labelClass) {
    var togglesState = SettingsManager.get(labelClass);
    SettingsManager.set(labelClass, !togglesState);
  }
  toggleAll() {
    this.toggleVisbility(Setting.SHOW_LABELS);
  }

  toggleArrows() {
    this.toggleVisbility(Setting.SHOW_ARROW_LABELS);
  }

  toggleShapes() {
    this.toggleVisbility(Setting.SHOW_SHAPE_LABELS);
  }

  toggleRelations() {
    this.toggleVisbility(Setting.SHOW_RELATION_LABELS);
  }

  toggleContainers() {
    this.toggleVisbility(Setting.SHOW_CONTAINER_LABELS);
  }

  toggleText() {
    this.toggleVisbility(Setting.SHOW_TEXT_LABELS);
  }

  render() {
    return (
      <div>
        <input id="chk-toggle-labels" type="checkbox" checked={this.state.checkedAll}
               onChange={this.toggleAll} />
        <label htmlFor="chk-toggle-labels">Show All Labels</label>
        <input id="chk-toggle-labels" type="checkbox" checked={this.state.checkedArrows}
               onChange={this.toggleArrows} />
        <label htmlFor="chk-toggle-labels">Arrows</label>
        <input id="chk-toggle-labels" type="checkbox" checked={this.state.checkedShapes}
               onChange={this.toggleShapes} />
        <label htmlFor="chk-toggle-labels">Shapes</label>
        <input id="chk-toggle-labels" type="checkbox" checked={this.state.checkedRelations}
               onChange={this.toggleRelations} />
        <label htmlFor="chk-toggle-labels">Relations</label>
        <input id="chk-toggle-labels" type="checkbox" checked={this.state.checkedContainers}
               onChange={this.toggleContainers} />
        <label htmlFor="chk-toggle-labels">Containers</label>
        <input id="chk-toggle-labels" type="checkbox" checked={this.state.checkedText}
               onChange={this.toggleText} />
        <label htmlFor="chk-toggle-labels">Text</label>
      </div>
    );
  }
}

module.exports = LabelVisiblityToggle;
