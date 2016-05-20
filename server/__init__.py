# from flask import Flask, jsonify, make_response
# from flask.ext.cors import CORS
import datetime
import json
from bson.objectid import ObjectId
from flask import Flask, request, Response, make_response


app = Flask(__name__, static_folder='../build', static_url_path='', template_folder='../build')
# cors = CORS(app)


def jsonify(*args, **kwargs):
    return Response(json.dumps(*args, cls=json.JSONEncoder), mimetype='application/json', **kwargs)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad request'}), 400)


@app.route('/')
def index():
    return app.send_static_file('index.html')


from server.api import api


