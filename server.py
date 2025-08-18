import os, flask
app, BASE_DIR = flask.Flask(__name__),os.path.dirname(os.path.abspath(__file__))
@app.route('/')
def index():
    return flask.send_from_directory(BASE_DIR, 'index.html')
@app.route('/static/<path:filename>')
def static_files(filename):
    return flask.send_from_directory(os.path.join(BASE_DIR,'static'),filename)
app.run(host='127.0.0.1', port=5000)