from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from saien.config import Config


app = Flask(__name__)
app.config.from_object(Config)


# establish database and other instances here
db = SQLAlchemy(app)
db.create_all()
# establish end

from saien.level0.views import level0
app.register_blueprint(level0)

#from saien import views
