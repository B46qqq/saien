from flask import render_template, redirect, request, Blueprint, url_for, flash, session
from flask_login import login_user, current_user, logout_user, login_required
from .forms import LoginForm
from saien.models import *
from saien import login_manager

admin = Blueprint('admin', __name__)

@login_manager.user_loader
def load_user(admin_id):
    if admin_id is not None:
        return Admin.query.get(admin_id)
    return None

@login_manager.unauthorized_handler
def unauthorized():
    return "NO PERMISSION"


@admin.route('/admin/', methods=['GET', 'POST'])
def index():
    if current_user.is_authenticated:
        return redirect(url_for('admin.dashboard'))
    
    form = LoginForm()
    if request.method == 'POST':
        if form.validate():
            target = Admin.query.filter_by(name = str(form.username.data)).first()

            if target != None and target.check_password(str(form.password.data)):
                login_user(target)
                session.permanent = True
                return redirect(url_for('level0.index'))
            else:
                flash('Invalid credentials')
                return redirect(url_for('admin.index'), code=302)
            
    return render_template('admin_login.html',
                           form = form)


@admin.route('/admin/dashboard/', methods=['GET'])
@login_required
def dashboard():
    return "welcome admin"


@admin.route('/admin/logout', methods=['GET'])
@login_required
def admin_logout():
    logout_user()
    return "admin is logged out"

