'use strict';

const React = require('react');
const AnnotationClickManager = require('../model/annotation-click-manager');
const AnnotationManager = require('../model/annotation-manager');
const AnnotationType = require('../model/annotation-type');
const ShapeAnnotation = require('../model/shape-annotation');
const ContainerAnnotation = require('../model/container-annotation');
const TextAnnotation = require('../model/text-annotation');
const QuestionAnnotation = require('../model/question-annotation');
const RelationshipAnnotation = require('../model/relationship-annotation');
const ArrowAnnotation = require('../model/arrow-annotation');
const Annotator = require('./annotator.jsx');
const Radium = require('radium');

class RelationshipAnnotator extends Annotator {
  constructor(props) {
    super(props);
  }
  // handleAnnotationClick(annotation) {
  //   if (this.relationship.isRelated(annotation.id)) {
  //     if (this.relationship.source === annotation.id) {
  //       this.relationship.removeSourceId();
  //     } else {
  //       this.relationship.removeTargetId();
  //     }
  //     annotation.removeRelationship(this.relationship);
  //   } else {
  //     if (!this.relationship.source) {
  //       this.relationship.setSourceId(annotation.id);
  //     } else {
  //       this.relationship.setTargetId(annotation.id);
  //     }
  //     annotation.addRelationship(this.relationship);
  //   }
  // }

  handleAnnotationClick(annotation) {
    if (this.relationship.isRelated(annotation.id)) {
      if (this.relationship.source === annotation.id) {
        this.relationship.removeSourceId();
      } else {
        this.relationship.removeTargetId();
      }
      annotation.removeRelationship(this.relationship);
    } else {
      if (!this.relationship.source) {
        this.relationship.setSourceId(annotation.id);
      } else {
        this.relationship.setTargetId(annotation.id);
      }
      annotation.addRelationship(this.relationship);
    }
  }

  handleArrowPointClick(annotation, arrowPoint, arrowPointType) {
    var removed;
    switch (arrowPointType) {
      case 'origin':
        if (this.relationship.arrowOrigin) {
          this.relationship.removeOriginId();
          if (this.relationship.arrowOrigin === arrowPoint.id) {
            annotation.removeRelationship(this.relationship);
          } else {
            removed = AnnotationManager.getAnnotation(
                this.props.imageId,
                this.relationship.arrowOrigin
                );
            removed.removeRelationship(this.relationship);
            this.relationship.setArrowOriginId(arrowPoint.id, arrowPoint.remoteId);
            annotation.addRelationship(this.relationship);
          }
        } else {
          this.relationship.setArrowOriginId(arrowPoint.id, arrowPoint.remoteId);
          annotation.addRelationship(this.relationship);
        }
        break;
      case 'destination':
        if (this.relationship.arrowDestination) {
          this.relationship.removeDestinationId();
          if (this.relationship.arrowDestination === arrowPoint.id) {
            annotation.removeRelationship(this.relationship);
          } else {
            removed = AnnotationManager.getAnnotation(
                this.props.imageId,
                this.relationship.arrowDestination
                );
            removed.removeRelationship(this.relationship);
            this.relationship.setArrowDestinationId(arrowPoint.id, arrowPoint.remoteId);
            annotation.addRelationship(this.relationship);
          }
        } else {
          this.relationship.setArrowDestinationId(arrowPoint.id, arrowPoint.remoteId);
          annotation.addRelationship(this.relationship);
        }
        break;
    }

  }

  handleClickEvent(event, annotation, arrowPoint, arrowPointType) {
    if(annotation instanceof QuestionAnnotation){
      annotation.category = AnnotationManager.getCurrentCategory();
      annotation.group_n= AnnotationManager.getCurrentGroupNumber();
      AnnotationManager.addAnnotation(this.props.imageId, annotation);
    }
  }
  //   if (!this.relationship) {
  //     this.relationship = new RelationshipAnnotation(
  //         AnnotationManager.getNewAnnotationId(AnnotationType.RELATIONSHIP)
  //     );
  //   }
  //   if (annotation instanceof ShapeAnnotation || annotation instanceof TextAnnotation || annotation instanceof ContainerAnnotation ) {
  //     this.handleAnnotationClick(annotation);
  //   } else if (annotation instanceof ArrowAnnotation) {
  //     this.handleArrowPointClick(annotation, arrowPoint, arrowPointType);
  //   }
  //
  //   if(this.relationship.source && this.relationship.target) {
  //     AnnotationManager.addAnnotation(this.props.imageId, this.relationship);
  //     this.relationship = undefined;
  //   }
  // }

  componentDidMount() {
    super.componentDidMount();
    AnnotationClickManager.activate().clicked(this.handleClickEvent.bind(this));
  }

  cancel() {
    AnnotationManager.removeRelationships(this.props.imageId, this.relationship);
    this.relationship = undefined;
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    AnnotationClickManager.deactivate();
    // Remove a pending relationship
    if (this.relationship) {
      AnnotationManager.removeRelationships(this.props.imageId, this.relationship);
      this.relationship.removeAllListeners();
      this.relationship = undefined;
    }
  }



  render() {
    var tool_body = window.document.getElementsByTagName('main')[0];
    var body_height = tool_body.clientHeight;
    var cssClass = 'annotation-pane relationship-annotation-pane';
    var style = {
      border: '8px dotted @blue'
    }
    return (
      <div className={cssClass}
        style={style}>
        <div className="annotation-pane-image" ref="origin">
          <img src={this.props.imageUrl} style={{height: body_height}} />
          {this.props.annotations}
        </div>
      </div>
    );
  }
}

module.exports = RelationshipAnnotator;
