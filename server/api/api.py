from flask import abort, request
from server import app
from server import jsonify
import json
import requests as rq
import pprint
from subprocess import call
import utils.url_gen as url_builder


book_groups, range_lookup = url_builder.load_book_info()


def valid_request(req):
    if not req.json:
        return False
    if 'description' in req.json and type(req.json['description']) is not str:
        return False
    if 'done' in req.json and type(req.json['done']) is not bool:
        return False
    if 'order' in req.json and type(req.json['order']) is not int:
        return False
    
    return True


i_path = 'https://s3-us-west-2.amazonaws.com/ai2-vision-turk-data/textbook-annotation-test/page-images/'
a_path = 'https://s3-us-west-2.amazonaws.com/ai2-vision-turk-data/textbook-annotation-test/annotations/'
i1 = 'Daily_Science_Grade_5_Evan_Moor_149.jpeg'
a1 = 'Daily_Science_Grade_5_Evan_Moor_149.json'
i2 = 'Spectrum_Science_Grade_7_40.jpeg'
a2 = 'Spectrum_Science_Grade_7_40.json'

fields = ['id', 'url']
with open(a1) as f:
    aj1 = json.load(f)
    flattened_json = []
    for a_type, objs in aj1.items():
        for obj_name, obj in objs.items():
            obj['type'] = a_type
            flattened_json.append({obj_name: obj})
    # print(flattened_json)


def flatten_json(annotations):
    flattened_json = []
    for a_type, objs in annotations.items():
        for obj_name, obj in objs.items():
            obj['type'] = a_type
            flattened_json.append({obj_name: obj})
    return flattened_json

@app.route('/api/datasets/1/nextImage', methods=['GET'])
def get_image():
    img_val = [1, i_path + i1]
    img_dict = dict(zip(fields, img_val))
    img_json =jsonify(img_dict)
    # print(dir(img_json))
    # print(img_json.data)
    return img_json


@app.route('/api/datasets/1/images', methods=['GET'])
def get_finished_image():
    return jsonify([1, 2, 3])


@app.route('/api/nextImage/2', methods=['GET'])
def get_image2():
    img_val = [2, i_path + i2]
    img_dict = dict(zip(fields, img_val))
    img_json =jsonify(img_dict)
    # print(dir(img_json))
    # print(img_json.data)
    return img_json


@app.route('/api/images/1', methods=['GET', 'PUT'])
def get_image_nodata():
    if request.method == "PUT":
        # print(request.data)
        return 'test'
    else:
        img_val = [1, i_path + i1]
        img_dict = dict(zip(fields, img_val))
        img_json = jsonify(img_dict)
    return img_json


@app.route('/api/images/2', methods=['GET'])
def get_image_nodata2():
    img_val = [2, i_path + i2]
    img_dict = dict(zip(fields, img_val))
    img_json = jsonify(img_dict)
    return img_json


@app.route('/api/images/1/annotations', methods=['GET', 'POST'])
def get_annotation():
    if request.method == 'POST':
        # labeled_boxes = json.loads(request.data.decode('string-escape'))
        labeled_boxes = json.loads(json.loads(request.data))
        # for box in labeled_boxes:
        #     aj1['text'][box['id']]['category'] = box['category']
        # with open('example_annotation.json', 'w') as tf:
        #     json.dump(aj1, tf)
        return "test"
    else:
        response = rq.get(a_path + a1)
        ann_json = flatten_json(json.loads(response.content))
    return jsonify(ann_json)


@app.route('/api/images/2/annotations', methods=['GET'])
def get_annotation2():
    if request.method == 'POST':
        # labeled_boxes = json.loads(request.data.decode('string-escape'))
        labeled_boxes = json.loads(json.loads(request.data))
        for box in labeled_boxes:
            aj2['text'][box['id']]['category'] = box['category']
        with open('example_annotation.json', 'w') as tf:
            json.dump(aj2, tf)
        return "test"
    else:
        response = rq.get(a_path + a2)
        ann_json = flatten_json(json.loads(response.content))
    return jsonify(ann_json)


