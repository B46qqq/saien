from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from saien.config import Config
from saien.models import db


app = Flask(__name__)
app.config.from_object(Config)

# establish database
db.init_app(app)
# db doesn't know which is the currently running app,
# The below is needed
with app.app_context():
    db.create_all()
# establish end

login = LoginManager(app)

# establish routes
from saien.level0.views import level0
from saien.admin.views import admin
app.register_blueprint(level0)
app.register_blueprint(admin)

