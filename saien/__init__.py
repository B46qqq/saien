from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
login_manager = LoginManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__, instance_relative_config = False)
    app.config.from_object('config.Config')

    db.init_app(app)
    login_manager.init_app(app)
    bcrypt.init_app(app)

    with app.app_context():
        
        from saien.level0.views import level0
        from saien.user.views import user
        from saien.admin.views import admin
        app.register_blueprint(level0)
        app.register_blueprint(admin)
        app.register_blueprint(user)

        db.create_all()

        return app
