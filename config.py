from os import environ

class Config:
    # General config
    SECRET_KEY = environ.get('SAIEN_SECRET')
    FLASK_APP = environ.get('SAIEN_APP')
    FLASK_ENV = environ.get('DEVELOPMENT')

    # CSRF
    WTF_CSRF_ENABLED = True

    # Flask-Bcrypt
    BCRYPT_LOG_ROUNDS = 10

    # Flask-SQLAlchemy
    SQLALCHEMY_DATABASE_URI = environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False