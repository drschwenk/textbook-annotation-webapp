from flask import abort, request
from server import app
from server import jsonify
import json
import requests as rq
import pprint
from flask_restful import Resource, Api

import utils.url_gen as url_builder

api = Api(app)

book_groups, range_lookup = url_builder.load_book_info()

group_image_urls = url_builder.make_book_group_urls(book_groups, 'daily_sci', range_lookup, url_builder.form_image_url)
# group_image_urls = group_image_urls[800:840]

pages_to_review_idx = range(1, len(group_image_urls)+1, 50)

# i_path = 'https://s3-us-west-2.amazonaws.com/ai2-vision-turk-data/textbook-annotation-test/page-images/'
# a_path = 'https://s3-us-west-2.amazonaws.com/ai2-vision-turk-data/textbook-annotation-test/annotations/'
# i1 = 'Daily_Science_Grade_5_Evan_Moor_149.jpeg'
# a1 = 'Daily_Science_Grade_5_Evan_Moor_149.json'
# i2 = 'Spectrum_Science_Grade_7_40.jpeg'
# a2 = 'Spectrum_Science_Grade_7_40.json'


class Image(Resource):
    fields = ['id', 'url']

    def get(self, image_idx):
        return_items = [image_idx, group_image_urls[image_idx]]
        items_json = jsonify(dict(zip(self.fields, return_items)))
        return items_json

    def put(self, image_idx):
        return "test"


class Annotation(Resource):
    def flatten_json(self, annotations):
        flattened_json = []
        for a_type, objs in annotations.items():
            for obj_name, obj in objs.items():
                obj['type'] = a_type
                flattened_json.append({obj_name: obj})
        return flattened_json

    def transform_url(self, url):
        return url.replace('page-images', 'annotations').replace('jpeg', 'json')

    def get(self, image_idx):
        image_url = group_image_urls[image_idx]
        annotation_url = self.transform_url(image_url)
        remote_annotation = rq.get(annotation_url)
        annotation_json = self.flatten_json(json.loads(remote_annotation.content))
        return annotation_json

    def put(self, image_idx):
        return 'test'

# class ImageGroup(Resource):


class NextImage(Image):
    def __init__(self):
        Image.__init__(self)

api.add_resource(Image, '/api/images/<int:image_idx>')
api.add_resource(Annotation, '/api/images/<int:image_idx>/annotations')
api.add_resource(NextImage, '/api/datasets/<int:image_idx>/nextImage')


@app.route('/api/datasets/1/images', methods=['GET'])
def get_finished_image():
    return jsonify(pages_to_review_idx)



# @app.route('/api/datasets/1/nextImage', methods=['GET'])
# def get_image():
#     img_val = [1, i_path + i1]
#     img_dict = dict(zip(fields, img_val))
#     img_json =jsonify(img_dict)
#     return img_json
#

#
# @app.route('/api/images/1', methods=['GET', 'PUT'])
# def get_image_nodata():
#     if request.method == "PUT":
#         # print(request.data)
#         return 'test'
#     else:
#         img_val = [1, i_path + i1]
#         img_dict = dict(zip(fields, img_val))
#         img_json = jsonify(img_dict)
#     return img_json
#
#
# @app.route('/api/images/2', methods=['GET'])
# def get_image_nodata2():
#     img_val = [2, i_path + i2]
#     img_dict = dict(zip(fields, img_val))
#     img_json = jsonify(img_dict)
#     return img_json
#
#
# @app.route('/api/images/1/annotations', methods=['GET', 'POST'])
# def get_annotation():
#     if request.method == 'POST':
#         return "test"
#     else:
#         response = rq.get(a_path + a1)
#         ann_json = flatten_json(json.loads(response.content))
#     return jsonify(ann_json)
#
#
# @app.route('/api/images/2/annotations', methods=['GET'])
# def get_annotation2():
#     if request.method == 'POST':
#         return "test"
#     else:
#         response = rq.get(a_path + a2)
#         ann_json = flatten_json(json.loads(response.content))
#     return jsonify(ann_json)
#

