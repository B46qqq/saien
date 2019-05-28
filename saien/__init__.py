from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_utils import database_exists
from saien.config import Config


app = Flask(__name__)
app.config.from_object(Config)


# establish database and other instances here
db = SQLAlchemy(app)

# establish end

from saien.level0.views import level0
app.register_blueprint(level0)

#from saien import views
