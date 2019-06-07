from flask import render_template, redirect, request, Blueprint, url_for, flash
from flask_login import login_user, current_user, logout_user, login_required
from .forms import LoginForm
from saien.models import *
from saien import login_manager

admin = Blueprint('admin', __name__)

@admin.route('/admin', methods=['GET', 'POST'])
def index():
    form = LoginForm()
    if request.method == 'POST':
        if form.validate():
            target = Admin.query.filter_by(name = str(form.username.data)).first()

            if target != None and target.check_password(str(form.password.data)):
                return redirect(url_for('level0.index'))
            else:
                flash('Invalid credentials')
                return redirect(url_for('admin.index'), code=302)
            
    return render_template('admin_login.html',
                           form = form)

