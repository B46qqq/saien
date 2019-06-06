from flask import render_template, redirect, request, Blueprint, url_for
from flask_login import login_user, current_user, logout_user, login_required
from .forms import LoginForm
from saien.models import *
from saien import login_manager

admin = Blueprint('admin', __name__)

@admin.route('/admin')
def management():
    return render_template('base_bg_sb.html')
