'use strict';

const React = require('react');

const AnnotationBounds = require('./annotation-bounds.jsx');
const Agent = require('../util/agent');
const RelateableComponent = require('./relateable-component.jsx');
const AnnotationClickManager = require('../model/annotation-click-manager');
const KeyMaster = require('../util/key-master');
const KeyCode = require('../util/key-code');

class ArrowPoint extends RelateableComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.persistRotationTimeout = undefined;
  }

  toggleRelationshipState() {  
    this.setState({ isRelated: this.props.annotation.isRelated(this.props.point.id) });
  }

  persistRotation() {
    clearTimeout(this.persistRotationTimeout);
    var arrowDestination = this.props.point;
    this.persistRotationTimeout = setTimeout(function() {  
      Agent.updateArrowDestinationRotation(arrowDestination);
    }, 1000);
  }

  handleArrowDown() {
    this.props.point.rotation -= 10;
    while (this.props.point.rotation <= 0) {
      this.props.point.rotation += 360;
    }
    this.persistRotation();
    this.setState({rotation: this.props.point.rotation});
  }

  handleArrowUp() {
    // reset at 360
    this.props.point.rotation += 10;
    while (this.props.point.rotation >= 360) {
      this.props.point.rotation -= 360;
    }
    this.persistRotation();
    this.setState({rotation: this.props.point.rotation});
  }

  registerKeybindings() {
    if (this.props.type === 'destination') {
      // must unbound the keys otherwise we can't rebind
      // them for a new destination
      KeyMaster.off(KeyCode.ARROW_DOWN);
      KeyMaster.off(KeyCode.ARROW_UP);

      var arrowUp = this.handleArrowUp.bind(this);
      var arrowDown = this.handleArrowDown.bind(this);
      KeyMaster.on(KeyCode.ARROW_UP, function(event) {
        arrowUp();
        event.stopPropagation();
      });

      KeyMaster.on(KeyCode.ARROW_DOWN, function(event) {
        arrowDown();
        event.stopPropagation();
      });
    }
  }

  componentDidMount() {
    this.registerKeybindings();
  }

  coponentWillUnmount() {
    KeyMaster.off(KeyCode.ARROW_DOWN);
    KeyMaster.off(KeyCode.ARROW_UP);
  }

  onClick() {
    // we re-register the keybindings to allow users to update the
    // arrow orientation for an image that has already been annotated
    this.registerKeybindings();
    AnnotationClickManager.clicked(this.props.annotation, this.props.point, this.props.type);
  }
  render() {
    const bounds = this.props.point.getBoundingRectangle();

    const cssClass = this.getRelatedCssClass();
    const relationshipLabels = this.renderRelationshipLabels();
    const arrowHeight = Math.floor(bounds.height/3);
    const marginTop = Math.round((bounds.height/2) - arrowHeight);

    var arrowOrientorStyle = {
      transform: 'rotate(' + (360 - this.props.point.rotation) + 'deg)',
      borderTopWidth: arrowHeight + 'px',
      borderLeftWidth: (bounds.width  * 1.5) + 'px',
      borderBottomWidth: arrowHeight + 'px',
      marginTop: marginTop
    };

    var overlay;
    if (this.props.type === 'destination') {
      overlay = (<div style={arrowOrientorStyle} className='arrow-orientor' />);
    }


    return (
      <AnnotationBounds
          className={cssClass}
          arrowLabel={this.props.point.id}
          relationshipLabels={relationshipLabels}
          onClick={this.onClick}
          overlay={overlay}
          x1={bounds.left}
          y1={bounds.top}
          x2={bounds.right}
          y2={bounds.bottom} />
    );
  }
}

module.exports = ArrowPoint;
