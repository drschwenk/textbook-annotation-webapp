from server import app
from server import jsonify
import json
import requests as rq
import ast
from flask_restful import Resource, Api, reqparse
import utils.url_gen as url_builder

api = Api(app)

book_groups, range_lookup = url_builder.load_book_info()

group_image_urls = url_builder.make_book_group_urls(book_groups, 'daily_sci', range_lookup, url_builder.form_image_url)
group_image_urls += url_builder.make_book_group_urls(book_groups, 'spectrum_sci', range_lookup, url_builder.form_image_url)
group_image_urls += url_builder.make_book_group_urls(book_groups, 'read_und_sci', range_lookup, url_builder.form_image_url)
group_image_urls += url_builder.make_book_group_urls(book_groups, 'workbooks', range_lookup, url_builder.form_image_url)
group_image_urls = url_builder.random_subset(group_image_urls, 100)
# group_image_urls = group_image_urls[160:260]
pages_to_review_idx = range(1, len(group_image_urls) + 1)

parser = reqparse.RequestParser()
parser.add_argument('pages_to_review', type=str)
s3_path_base = 'https://s3-us-west-2.amazonaws.com/ai2-vision-turk-data/textbook-annotation-test/'
local_base_path = '/Users/schwenk/wrk/notebooks/stb/ai2-vision-turk-data/textbook-annotation-test/'


class Image(Resource):
    fields = ['id', 'url']

    def get(self, image_idx):
        return_items = [image_idx, group_image_urls[image_idx]]
        items_json = jsonify(dict(zip(self.fields, return_items)))
        return items_json

    def put(self, image_idx):
        return "test"


class ReviewSequence(Resource):
    def post(self):
        image_base = s3_path_base + 'smaller-page-images/'
        args = parser.parse_args()
        pages_to_review = ast.literal_eval(args['pages_to_review'])
        urls_to_review = [image_base + page for page in pages_to_review]
        global group_image_urls
        group_image_urls = urls_to_review
        global pages_to_review_idx
        pages_to_review_idx = range(1, len(group_image_urls) + 1)
        return 'loaded'


class Annotation(Resource):
    def flatten_json(self, annotations):
        flattened_json = []
        for a_type, objs in annotations.items():
            for obj_name, obj in objs.items():
                obj['type'] = a_type
                flattened_json.append({obj_name: obj})
        return flattened_json

    def transform_url(self, url):
        return url.replace('smaller-page-images', 'unmerged_annotations').replace('jpeg', 'json')

    def import_local(self, url):
        # base_path =  local_base_path + 'labeled-annotations/'
        base_path = local_base_path + 'test-annotations/'
        anno_file = url.rsplit('/',  1)[1].replace('jpeg', 'json')
        file_path = base_path + anno_file
        with open(file_path, 'r') as f:
            local_annotations = json.load(f)
        return local_annotations

    def get(self, image_idx):
        image_url = group_image_urls[image_idx]
        # annotation_url = self.transform_url(image_url)
        # remote_annotation = rq.get(annotation_url)
        # annotation_json = self.flatten_json(json.loads(remote_annotation.content))
        raw_annotation_json = self.import_local(image_url)
        annotation_json = self.flatten_json(raw_annotation_json)
        return annotation_json

    def put(self, image_idx):
        return '200'


class NextImage(Image):
    def __init__(self):
        Image.__init__(self)

api.add_resource(Image, '/api/images/<int:image_idx>')
api.add_resource(Annotation, '/api/images/<int:image_idx>/annotations')
api.add_resource(NextImage, '/api/datasets/<int:image_idx>/nextImage')
api.add_resource(ReviewSequence, '/api/review')

@app.route('/api/datasets/1/images', methods=['GET'])
def get_finished_image():
    return jsonify(pages_to_review_idx)

