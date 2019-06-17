from flask import current_app
from flask_login import current_user
from functools import wraps

def admin_login_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not current_user.is_admin():
            return current_app.login_manager.unauthorized()
        if not current_user.is_authenticated:
            return current_app.login_manager.unauthorized()
        return func(*args, **kwargs)
    return decorated_view


def shop_login_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not current_user.is_shop():
            return current_app.login_manager.unauthorized()
        if not current_user.is_authenticated:
            return current_app.login_manager.unauthorized()
        return func(*args, **kwargs)
    return decorated_view
