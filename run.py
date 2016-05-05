from server import app
import pprint


class LoggingMiddleware(object):
    """
    wrapper for the flask app to intercept and display requests
    """
    def __init__(self, app):
        self._app = app

    def __call__(self, environ, resp):
        errorlog = environ['wsgi.errors']
        pprint.pprint(('REQUEST', environ), stream=errorlog)

        def log_response(status, headers, *args):
            pprint.pprint(('RESPONSE', status, headers), stream=errorlog)
            return resp(status, headers, *args)

        return self._app(environ, log_response)


# app.wsgi_app = LoggingMiddleware(app.wsgi_app)
app.run(debug=True, host='127.0.0.1', port=8080)
