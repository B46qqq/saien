from flask import Flask
from saien.config import Config


app = Flask(__name__)
app.config.from_object(Config)

from saien.level0.views import level0
app.register_blueprint(level0)

#from saien import views
