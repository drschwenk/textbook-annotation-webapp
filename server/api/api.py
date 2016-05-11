from flask import abort, request
from server import app
from server import jsonify
import json
from subprocess import call


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


i_path = 'https://s3-us-west-2.amazonaws.com/ai2-vision-turk-data/textbook-annotation-test/page-images/Daily_Science_Grade_5_Evan_Moor_10.jpeg'
a_path = 'https://s3-us-west-2.amazonaws.com/ai2-vision-turk-data/textbook-annotation-test/annotations/Daily_Science_Grade_5_Evan_Moor_149.json'

fields = ['id', 'url', 'state', 'sha256sum']
test_val = [1, i_path, 'pending', '0']


@app.route('/api/datasets/1/nextImage', methods=['GET'])
def get_image():
    img_dict = dict(zip(fields, test_val))
    img_json = json.dumps(img_dict)
    return jsonify(img_dict)


@app.route('/api/datasets/1/images', methods=['GET'])
def get_finished_image():

    return jsonify([0, 1, 2])


@app.route('/api/images/1/annotations', methods=['GET'])
def get_annotation():
    return jsonify([])

