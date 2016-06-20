'use strict';

const MessageManager = require('../util/message-manager');
const qwest = require('qwest');

function coords2bounds(coords) {
  return {
    x1:coords[0].x,
    y1:coords[0].x,
    x2:coords[1].x,
    y2:coords[1].y
  };
}
module.exports  = {
  deleteRelationship: (imageId, relationship) => {
    qwest.delete("/api/images/" + imageId + "/relationships/" + relationship.remoteId).catch(function(e) {
       MessageManager.warn('Failed to delete relationship: ' + e);
    });
  },
  updateImage: (image) => {
    qwest.put("/api/images/" + image.id, image, {dataType: 'json'}).catch(function(e){
      MessageManager.warn('Failed to update image: ' + e);
    });
  },
  getFinishedImageIds: (callback) => {
    qwest.get("/api/datasets/1/images?state=finished").then(callback).catch(function(e) {
      MessageManager.warn('Failed to load finished images: ' + e);
    });
  },

  nextImage: (callback) => {
    qwest.get("/api/datasets/1/nextImage").then(callback).catch(function(e) {
      MessageManager.warn('Failed to load finished images: ' + e);
    });
  },

  getImage: (imageId, callback) => {
    qwest.get("/api/images/" + imageId).then(callback).catch(function(e) {
      MessageManager.warn('Failed to get image: ' + e);
    });
  },
  saveRelationship: (imageId, relationshipAnnotation, sourceAnnotationId, targetAnnotationId) => {
    var relationship = {
      sourceAnnotationId: sourceAnnotationId,
      targetAnnotationId: targetAnnotationId
    };

    if (relationshipAnnotation.arrowOriginRemoteId && relationshipAnnotation.arrowDestinationRemoteId) {
      relationship.arrowOriginId = relationshipAnnotation.arrowOriginRemoteId;
      relationship.arrowDestinationId = relationshipAnnotation.arrowDestinationRemoteId;
    }

    qwest.post("/api/images/" + imageId + "/relationships", relationship, {dataType: 'json'}).then(function(response) {
      relationshipAnnotation.remoteId = response.id;
    }).catch(function(e) {
      MessageManager.warn('Failed to save relationship: ' + e);
    });
  },
  deleteAnnotation: (imageId, annotation) => {
    qwest.delete("/api/images/" + imageId + "/annotations/" + annotation.remoteId).catch(function(e) {
      MessageManager.warn('Failed to delete annotation: ' + e);
    });
  },
  updateArrowDestinationRotation: (arrowDestination) => {
    var destination = {
      rotation: arrowDestination.rotation,
      bounds: coords2bounds(arrowDestination.coords),
      id: arrowDestination.remoteId
    };

    qwest.put(arrowDestination.remoteUrl, destination, {dataType: 'json'}).catch(function(e) {
      MessageManager.warn('Failed to update arrow destination' + e);
    });
  },

  saveArrow: (imageId, arrowAnnotation) => {

    var arrow = {
      origins: [],
      destinations: []
    };

    arrowAnnotation.origins.forEach(function(item, key) {
      arrow.origins.push({ bounds:coords2bounds(item.coords), key: key});
    });

    arrowAnnotation.destinations.forEach(function(item, key) {
      arrow.destinations.push({ bounds:coords2bounds(item.coords), rotation: 0, key: key});
    });
    var baseUrl = "/api/images/" + imageId;
    qwest.post(baseUrl + "/annotations/arrows", arrow, {dataType: 'json'}).then(function(response) {
      arrowAnnotation.remoteId = response.id;
      arrowAnnotation.remoteUrl = this.getResponseHeader('Location');
      response.origins.forEach(function(element) {
        arrowAnnotation.origins.get(element.key).remoteId = element.id;
        arrowAnnotation.origins.get(element.key).remoteUrl  = baseUrl + "/annotations/arrowOrigins/" + element.id;
      });

      response.destinations.forEach(function(element) {
        arrowAnnotation.destinations.get(element.key).remoteId = element.id;
        arrowAnnotation.destinations.get(element.key).remoteUrl = baseUrl + "/annotations/arrowDestinations/" + element.id;
      });
    }).catch(function(e){
      MessageManager.warn('Failed to save new arrow' + e);
    });
  },
  saveAnnotation: (annotationManager, imageId, annotation) => {

    // var bounds = {x1: annotation.bounds.coords[0].x, y1: annotation.bounds.coords[0].y,
    //               x2: annotation.bounds.coords[1].x, y2: annotation.bounds.coords[1].y};

    // when we save shapes, its possible to assign a relationship to an existing
    // text annotation, since a relationship needs ids to be created we defer creation
    // of the relationship until the shape is created, then save the relationship
    // var relationshipCallback = function(relationship) {
    //   if (!relationship.remoteId) {
    //     annotationManager.addAnnotation(imageId, relationship);
    //   }
    // };

    var category_designation = annotation.category;
    qwest.post("/api/images/" + imageId + "/annotations",
      {category: category_designation}, {dataType: 'json'}).catch(function(e){
      MessageManager.warn('Failed to save annotation' + e);
    });
  },
  saveAnnotations: (imageId, annotation_map) => {
    var return_vals = [];
    for(var a_map  in annotation_map){
      // console.log(annotation_map[a_map]);
      annotation_map[a_map].forEach(function(obj, key){
      var subset = ['id', 'category'].reduce(function (o, k) {
        // console.log(o);
        o[k] = obj[k];
        // console.log(o);
        return o;
      },{});
      return_vals.push(subset);
      });
    }
    var json_return_vals = JSON.stringify(return_vals);
      qwest.post("/api/images/" + imageId + "/annotations",
        json_return_vals, {dataType: 'json'}).catch(function(e){
        MessageManager.warn('Failed to save annotation' + e);
    });
  }
};
