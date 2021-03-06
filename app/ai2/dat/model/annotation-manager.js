'use strict';

const EventEmitter = require('../util/event-emitter');
const AnnotationType = require('./annotation-type');
const AnnotationMode = require('./annotation-mode');
const Agent = require('../util/agent');
const AnnotationManagerEvent = require('./annotation-manager-event');
const RelationshipAnnotation = require('./relationship-annotation');
const ArrowAnnotation = require('./arrow-annotation');
const TextAnnotation = require('./text-annotation');
const ContainerAnnotation = require('./container-annotation');
const ShapeAnnotation = require('./shape-annotation');
const Bounds = require('./bounds');
const Point = require('../model/point');
const ArrowPointBounds = require('./arrow-point-bounds');
const Reader = require('../util/reader');
const MessageManager = require('../util/message-manager');
const ImageManager = require('./image-manager');
const qwest = require('qwest');

class AnnotationCollection {
  constructor() {
    this.annotationsById = new Map();
  }
  add(annotation) {
    this.annotationsById.set(annotation.id, annotation);
    return this;
  }
  has(annotationId) {
    return this.annotationsById.has(annotationId);
  }
  get(annotationId) {
    return this.annotationsById.get(annotationId);
  }
  remove(annotationId) {
    var removed = this.annotationsById.get(annotationId);
    this.annotationsById.delete(annotationId);
    return removed;
  }
  count() {
    return this.annotationsById.size;
  }
  all() {
    return this.annotationsById;
  }
  groupedByType() {
    var byType = new Map();
    this.annotationsById.forEach(function(annotation) {
      if (!byType.has(annotation.type)) {
        byType.set(annotation.type, []);
      }
      byType.get(annotation.type).push(annotation);
    });
    return byType;
  }
}

class AnnotationManager extends EventEmitter {
  constructor() {
    super();
    this.mode = AnnotationMode.default();
    this.annotations = new Map();
    this.idSequence = 0;
  }
  clear() {
    this.annotations.clear();
    return this;
  }
  getMode() {
    return this.mode;
  }

  resetAnnotations(imageId) {
    this.annotations.set(imageId, new AnnotationCollection());
  }

  getAnnotations(imageId) {
    return this.annotations.get(imageId) || new AnnotationCollection();
  }
  getAnnotation(imageId, annotationId) {
    var annotation;
    if (this.annotations.has(imageId)) {
      annotation = this.annotations.get(imageId).get(annotationId);
    }
    return annotation;
  }
  hasAnnotations() {
    return this.annotations.size > 0;
  }
  addRelationships(imageId, relationship) {
    var annotations = this.getAnnotations(imageId).all();
    annotations.forEach(function(annotation) {
      var isRelated;
      if (annotation instanceof ArrowAnnotation) {
        isRelated = annotation.allPointIds().some(function(id) {
          return relationship.isRelated(id);
        });
      } else {
        isRelated = relationship.isRelated(annotation.id);
      }
      if (isRelated) {
        annotation.addRelationship(relationship);
      }
    });
  }
  removeRelationships(imageId, relationship) {
    var annotations = this.getAnnotations(imageId).all();
    annotations.forEach(function(annotation) {
      var isRelated;
      if (annotation instanceof ArrowAnnotation) {
        isRelated = annotation.allPointIds().some(function(id) {
          return relationship.isRelated(id);
        });
      } else {
        isRelated = relationship.isRelated(annotation.id);
      }
      if (isRelated) {
        annotation.removeRelationship(relationship);
      }
    });
  }

  importAnnotation(imageId, annotation) {
    if (!this.annotations.has(imageId)) {
      this.annotations.set(imageId, new AnnotationCollection());
    }
    this.annotations.get(imageId).add(annotation);
    if (annotation instanceof RelationshipAnnotation) {
      this.addRelationships(imageId, annotation);
    }
    this.emit(AnnotationManagerEvent.ANNOTATION_ADDED, imageId, annotation);
    return this;
  }

  addAnnotation(imageId, annotation) {
    if (!this.annotations.has(imageId)) {
      this.annotations.set(imageId, new AnnotationCollection());
    }
    this.annotations.get(imageId).add(annotation);
    if (annotation instanceof RelationshipAnnotation) {
      this.addRelationships(imageId, annotation);
      var targetId = this.getAnnotation(imageId, annotation.target).remoteId;
      var sourceId = this.getAnnotation(imageId, annotation.source).remoteId;
      Agent.saveRelationship(imageId, annotation, sourceId, targetId);
    } else if (annotation instanceof ArrowAnnotation) {
      Agent.saveArrow(imageId, annotation);
    } else {
      Agent.saveAnnotation(this, imageId, annotation);
    }
    this.emit(AnnotationManagerEvent.ANNOTATION_ADDED, imageId, annotation);
    return this;
  }
  removeAnnotation(imageId, annotationId) {
    if (this.annotations.has(imageId)) {
      if (this.annotations.get(imageId).has(annotationId)) {
        var removed = this.annotations.get(imageId).remove(annotationId);
        if (removed instanceof RelationshipAnnotation) {
          this.removeRelationships(imageId, removed);
          Agent.deleteRelationship(imageId, removed);
        } else {
          Agent.deleteAnnotation(imageId, removed);
        }
        this.emit(AnnotationManagerEvent.ANNOTATION_REMOVED, imageId, removed);
      }
    }
    return this;
  }
  getNewAnnotationId(annotationType) {
    this.idSequence += 1;
    return [ annotationType.substr(0, 1).toUpperCase(), this.idSequence].join('');
  }
  setMode(mode) {
    if (mode !== this.mode) {
      this.mode = mode;
      this.emit(AnnotationManagerEvent.MODE_CHANGED, this.mode);
    }
    return this;
  }

  importRemoteArrowAnnotation(imageId, remoteArrowAnnotation, remoteAnnotationMap, remoteArrowOriginMap, remoteArrowDestinationMap) {

    var baseUrl = "/api/images/" + imageId;
    var annotation = new ArrowAnnotation(this.getNewAnnotationId(AnnotationType.ARROW));
    remoteArrowAnnotation.origins.forEach(function(ro) {
      var arrowPoint = new ArrowPointBounds(annotation.getNextOriginId(), ro.rotation, {"x": ro.bounds.x1, "y": ro.bounds.y1}, {"x": ro.bounds.x2, "y": ro.bounds.y2});
      arrowPoint.remoteId = ro.id;
      arrowPoint.remoteUrl = baseUrl + "/annotations/arrowOrigins/" + ro.id;
      remoteArrowOriginMap.set(ro.id, arrowPoint.id);
      annotation.addOrigin(arrowPoint);
    });

    remoteArrowAnnotation.destinations.forEach(function(rd) {
      
      var arrowPoint = new ArrowPointBounds(annotation.getNextDestinationId(), rd.rotation, {"x": rd.bounds.x1, "y": rd.bounds.y1}, {"x": rd.bounds.x2, "y": rd.bounds.y2});
      arrowPoint.remoteId = rd.id;
      arrowPoint.remoteUrl = baseUrl + "/annotations/arrowDestinations/" + rd.id;
      remoteArrowDestinationMap.set(rd.id, arrowPoint.id);
      annotation.addDestination(arrowPoint);
    });

    annotation.remoteId = remoteArrowAnnotation.id;
    annotation.remoteUrl = baseUrl + imageId + "/annotations/arrows" + remoteArrowAnnotation.id;
    this.importAnnotation(imageId, annotation);
    remoteAnnotationMap.set(annotation.remoteId, annotation.id);
  }

  importRemoteAnnotation(imageId, remoteAnnotation, remoteAnnotationMap) {
    var bounds = new Bounds(new Point(remoteAnnotation.bounds.x1, remoteAnnotation.bounds.y1), new Point(remoteAnnotation.bounds.x2, remoteAnnotation.bounds.y2));

    var annotation;
    switch (remoteAnnotation.annotationType) {
      case AnnotationType.SHAPE:
        annotation = new ShapeAnnotation(this.getNewAnnotationId(AnnotationType.SHAPE),bounds);
        break;
      case AnnotationType.CONTAINER:
        annotation = new ContainerAnnotation(this.getNewAnnotationId(AnnotationType.CONTAINER), bounds);
        break;
      case AnnotationType.TEXT:
        annotation = new TextAnnotation(
            this.getNewAnnotationId(AnnotationType.CONTAINER),
            bounds,
            remoteAnnotation.text
            );
        break;
      case AnnotationType.ARROW: // skip arrows since they are imported separately
        break;
      default:
        console.error(
            'Unsupported annotation type: "' + remoteAnnotation.annotationType + '."'
            );
    }
    
    if (annotation) {
      annotation.remoteId = remoteAnnotation.id;
      annotation.remoteUrl = "/api/images/" + imageId + "/annotations/" + remoteAnnotation.id;
      this.importAnnotation(imageId, annotation);
      remoteAnnotationMap.set(annotation.remoteId, annotation.id);
    }
  }

  importRemoteRelationship(imageId, remoteRelationship, remoteAnnotationMap, remoteArrowOriginMap, remoteArrowDestinationMap) {

    var source = remoteAnnotationMap.get(remoteRelationship.sourceAnnotationId);
    var target = remoteAnnotationMap.get(remoteRelationship.targetAnnotationId);
    var relationship = new RelationshipAnnotation(
        this.getNewAnnotationId(AnnotationType.RELATIONSHIP),
        source,
        target
        );
    if (remoteRelationship.arrowOriginId && remoteRelationship.arrowDestinationId) {
      relationship.setArrowOriginId(remoteArrowOriginMap.get(remoteRelationship.arrowOriginId));
      relationship.setArrowDestinationId(remoteArrowDestinationMap.get(remoteRelationship.arrowDestinationId));
    }
    relationship.remoteId = remoteRelationship.id;
    this.importAnnotation(imageId, relationship);
  }

  importAnnotationsFromJson(imageId, annotations) {
    var imported = 0;
    if (ImageManager.hasImageWithName(imageId)) {
      // We need to do relationships last, so let's sort them accordingly
      annotations.sort(function(a, b) {
        const aIsRelationship = a.type === AnnotationType.RELATIONSHIP;
        const bIsRelationship = b.type === AnnotationType.RELATIONSHIP;

        // a is not a relationship, b is a relationship, sort it lower in the list
        if (!aIsRelationship && bIsRelationship) {
          return -1;
        }
        // a is a relationship, b is not, sort b lower in the last
        else if (aIsRelationship && !bIsRelationship) {
          return 1;
        }
        // no change, as they're either the same type or both not relationships
        else {
          return 0;
        }
      });
      annotations.forEach(function(annotation) {
        switch (annotation.type) {
          case AnnotationType.SHAPE:
            annotation = new ShapeAnnotation(
              annotation.id,
              new Bounds(annotation.bounds.coords)
            );
            break;
          case AnnotationType.CONTAINER:
            annotation = new ContainerAnnotation(
              annotation.id,
              new Bounds(annotation.bounds.coords)
            );
            break;
          case AnnotationType.ARROW:
            const origins = Array.isArray(annotation.origins) ? annotation.origins : [];
            const dests = Array.isArray(annotation.destinations) ? annotation.destinations : [];
            annotation = new ArrowAnnotation(
              annotation.id,
              origins.map(function(o) {
                return new ArrowPointBounds(o.id, o.rotation, ...o.coords);
              }),
              dests.map(function(d) {
                return new ArrowPointBounds(d.id, d.rotation, ...d.coords);
              })
            );
            break;
          case AnnotationType.TEXT:
            annotation = new TextAnnotation(
              annotation.id,
              new Bounds(annotation.bounds.coords),
              annotation.text
            );
            break;
          case AnnotationType.RELATIONSHIP:
            annotation = new RelationshipAnnotation(
              annotation.id,
              annotation.source,
              annotation.target,
              annotation.arrowOrigin,
              annotation.arrowDestination
            );
            break;
          default:
            MessageManager.warn(
              'Unsupported annotation type: "' + annotation.type + '."'
            );
        }
        this.addAnnotation(imageId, annotation);
      }.bind(this));
      imported = annotations.length;
    }
    return imported;
  }

  importRemoteAnnotations(image, callback) {
    var am = this;
    qwest.get("/api/images/" + image.id + "/annotations").then(function(response) {
      var imported = 0;
      var remoteAnnotationMap = new Map();
      var remoteArrowOriginMap = new Map();
      var remoteArrowDestinationMap = new Map();
      // response.annotations.forEach(function(annotation) {
      //   am.importRemoteAnnotation(image.id, annotation, remoteAnnotationMap);
      //   imported += 1;
      // });
      //
      // response.arrows.forEach(function(arrow) {
      //   am.importRemoteArrowAnnotation(image.id, arrow, remoteAnnotationMap, remoteArrowOriginMap, remoteArrowDestinationMap);
      // });
      //
      // response.relationships.forEach(function(remoteRelationship) {
      //   am.importRemoteRelationship(image.id, remoteRelationship, remoteAnnotationMap, remoteArrowOriginMap, remoteArrowDestinationMap);
      //   imported += 1;
      // });

       MessageManager.success(imported + ' annotations imported.');
      callback();
    }).catch(function(e) {
      MessageManager.warn("Error loading imageId: " + image.id + " " + e);
    });
  }
  import(file) {

    if (!Reader.isSupported) {
      MessageManager.error('File upload API not supported.');
    } else {
      Reader.read(file).then(
        function(data) {
          try {
            data = JSON.parse(data);
          } catch(e) {
            data = undefined;
            MessageManager.error(e.toString());
          }

          if (data) {
            var imported = 0;
            if (Array.isArray(data.annotations) && data.imageId) {
              imported += this.importAnnotationsFromJson(data.imageId, data.annotations);
            } else {
              Object.getOwnPropertyNames(data).forEach(function(imageId) {
                if (Array.isArray(data[imageId])) {
                  imported += this.importAnnotationsFromJson(imageId, data[imageId]);
                }
              }.bind(this));
            }
            if (imported > 0) {
              MessageManager.success(imported + ' annotations imported.');
            }
          }
        }.bind(this),
        function() {
          MessageManager.error('Upload failed.');
        }
      );
    }
  }
}

module.exports = new AnnotationManager();
