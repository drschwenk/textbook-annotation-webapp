'use strict';

const React = require('react');

const KeyMaster = require('../util/key-master');
const KeyCode = require('../util/key-code');
const Point = require('../model/point');

class Annotator extends React.Component {
  constructor(props) {
    super(props);
    this.state = { annotating: false, hoverPoint: new Point(0,0) };
    this.updateCrosshairs = this.updateCrosshairs.bind(this);
  }

  updateCrosshairs(event) {
    event.preventDefault();
    this.setState({ hoverPoint: this.getPoint(event)});
  }

  cancel() {
    this.setState({ annotating: false });
  }
  componentDidMount() {
    this.cancel = this.cancel.bind(this);
    // KeyMaster.on(KeyCode.ESCAPE, this.cancel);
  }
  componentWillUnmount() {
    KeyMaster.off(KeyCode.ESCAPE);
  }

  crosshairs() {
   var crossVStyle = { top: this.state.hoverPoint.y + 'px'};
   var crossHStyle = { left: this.state.hoverPoint.x + 'px'};
   return (<div><div className="crosshair-v" style={crossVStyle} /> <div className="crosshair-h" style={crossHStyle} /></div>);
  }

  getPoint(event) {
    var offset = React.findDOMNode(this.refs.origin).getBoundingClientRect();
    return new Point(
      event.clientX - offset.left,
      event.clientY - offset.top
    );
  }
}

module.exports = Annotator;
