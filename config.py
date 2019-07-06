from os import environ, path
from datetime import timedelta

PROJECT_ROOT = path.dirname(path.realpath(__file__))
DATABASE = path.join(PROJECT_ROOT, environ.get('SAIEN_DATABASE'))

class Config:
    # General config
    SECRET_KEY = environ.get('SAIEN_SECRET')
    FLASK_APP = environ.get('SAIEN_APP')
    FLASK_ENV = environ.get('DEVELOPMENT')

    # CSRF
    WTF_CSRF_ENABLED = True

    # Flask-Bcrypt
    BCRYPT_LOG_ROUNDS = 10

    # Session timeout
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=90)

    # Flask-SQLAlchemy
    # SQLALCHEMY_DATABASE_URI = environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + DATABASE
    SQLALCHEMY_TRACK_MODIFICATIONS = False
