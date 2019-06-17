from saien import login_manager
from saien.models import User
from flask_login import current_user

@login_manager.user_loader
def load_user(user):
    if user is not None:
        return User.query.get(user)
    return None

@login_manager.unauthorized_handler
def unauthorized():
    return "NO PERMISSION"
