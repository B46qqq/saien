from flask import render_template, redirect, Blueprint, url_for
#from flask_login import login_user, current_user, logout_user, login_required
from sqlalchemy import exc
#from saien import login_manager

level0 = Blueprint('level0', __name__)

@level0.route('/')
def index():
    return render_template('level0_base.html')
