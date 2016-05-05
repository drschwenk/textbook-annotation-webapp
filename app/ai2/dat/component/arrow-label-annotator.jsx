'use strict';

const AnnotationManager = require('../model/annotation-manager');
const AnnotationType = require('../model/annotation-type');
const TextAnnotation = require('../model/text-annotation');
const RelationshipAnnotation = require('../model/relationship-annotation');
const ArrowAnnotation = require('../model/arrow-annotation');
const RelationshipAnnotator = require('./relationship-annotator.jsx');

class ArrowLabelAnnotator extends RelationshipAnnotator {
  constructor(props) {
    super(props);
  }

  handleClickEvent(event, annotation, arrowPoint, arrowPointType) {
    if (!this.relationship) {
      this.relationship = new RelationshipAnnotation(
          AnnotationManager.getNewAnnotationId(AnnotationType.RELATIONSHIP)
      );
    }
    if (annotation instanceof TextAnnotation ) {
      this.handleAnnotationClick(annotation);
    } else if (annotation instanceof ArrowAnnotation) {
      this.handleArrowPointClick(annotation, arrowPoint, arrowPointType);

      if (this.relationship.arrowOrigin && this.relationship.arrowDestination) {
        this.handleAnnotationClick(annotation);
      }
    }

    if(this.relationship.source && this.relationship.target) {
      AnnotationManager.addAnnotation(this.props.imageId, this.relationship);
      this.relationship = undefined;
    }
  }
}

module.exports = ArrowLabelAnnotator;
