from flask import render_template, redirect, request, Blueprint, url_for, flash, session
from flask_login import login_user, current_user, logout_user, login_required
from sqlalchemy import exc
from saien.models import Shop
from saien import login_manager

level0 = Blueprint('level0', __name__)

@login_manager.user_loader
def load_user(shop_id):
    if shop_id is not None:
        return Shop.query.get(shop_id)
    return None

@login_manager.unauthorized_handler
def unauthorized():
    return "NO PERMISSION"

@level0.route('/verify/')
def verify():
    return "hi there, i will verify later"

@level0.route('/')
def index():
    return render_template('level0_base.html')

@level0.route('/reset')
def reset():
    return redirect(url_for('level0.index'));
