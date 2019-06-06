from flask import render_template, redirect, request, Blueprint, url_for
from flask_login import login_user, current_user, logout_user, login_required
from .forms import UserLoginForm
from saien.models import db, Shop
from saien import login_manager

user = Blueprint('user', __name__)

@user.route('/u/verify', methods=['POST'])
def verify():
    postedValue = request.form
    print (postedValue)
    return "got it"

@user.route('/u/test', methods=['GET', 'POST'])
def test():
    if current_user.is_authenticated:
        return redirect(url_for('level0.index'))

    form = UserLoginForm(request.form)
    if request.method == 'POST':
        if form.validate_on_submit():
            USER = Shop.query.filter_by(shop_email = str(form.email.data)).first()
            if USER is None:
                print ("user does not exist -> display as login failed")
                return "Login failed"
            if USER.validate(form.password.data):
                login_user(_user_)
                print ("logged ! in!")
                return redirect(url_for('level0.index'))
        print ("wrong password")
        return redirect(url_for('user.test'))
    return render_template('login.html',
                           form=form)

@user.route('/u/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('level0.index'))


@login_manager.user_loader
def load_user(shop_id):
    if shop_id is not None:
        return Shop.query.get(shop_id)
    return None
