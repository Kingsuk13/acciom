import logging
import os
from logging.handlers import RotatingFileHandler
from threading import Lock

from celery import Celery
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

thread_lock = Lock()
thread = None

levels = {"DEBUG": logging.DEBUG,
          "INFO": logging.INFO,
          "ERROR": logging.ERROR,
          "WARNING": logging.WARNING}


def config_log(app):
    log_directory = app.config['LOG_LOCATION']
    log_file_location = log_directory + 'acciom.log'
    if not os.path.exists(log_directory):
        os.makedirs(log_directory)
    handler = RotatingFileHandler(log_file_location,
                                  maxBytes=10000,
                                  backupCount=1)
    handler.setFormatter(logging.Formatter(app.config['LOG_FORMAT']))
    app.logger.addHandler(handler)
    app.logger.setLevel(app.config['LOG_LEVEL'])


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.cfg')
    config_log(app)
    return app


def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery


basedir = os.path.abspath(os.path.dirname(__file__))
static_folder = basedir + '/acciom_ui/build/'
app = create_app()
CORS(app)
app.url_map.strict_slashes = False
db = SQLAlchemy(app)
api = Api(app)

socketio = SocketIO(app, cors_allowed_origins="*",
                    message_queue=app.config['SOCKET_MESSAGE_QUEUE'],
                    async_mode='threading')
celery = make_celery(app)
