from flask import render_template, redirect, request, Blueprint, url_for, flash, session
from flask_login import login_user, current_user, logout_user, login_required
from sqlalchemy import exc
from .forms import *
from saien.models import Shop
from saien import login_manager
from urllib.parse import urlparse, urljoin

user = Blueprint('user', __name__)

@login_manager.user_loader
def load_user(shop_id):
    if shop_id is not None:
        return Shop.query.get(shop_id)
    return None

@login_manager.unauthorized_handler
def unauthorized():
    return "NO PERMISSION"

@user.route('/u/verify', methods=['POST'])
def verify():
    target = Shop.query.filter_by(shop_email = str(request.form['email'])).first()
    retURL = get_redirect_target()
    if target is None:
        flash (u'Login unsuccessful')
        session['login_failed'] = True;
        return redirect(retURL)

    if retURL is not None:
        return redirect(retURL)
    print (request.form['email'])
    return "got it"

@user.route('/u/reroute/', methods=['GET'])
def uselessfunction():
    return render_template('level0_base.html')

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



def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
           ref_url.netloc == test_url.netloc

def get_redirect_target():
    for target in request.values.get('next'), request.referrer:
        if not target:
            continue
        if is_safe_url(target):
            return target

def redirect_back(endpoint, **values):
    target = request.form['next']
    if not target or not is_safe_url(target):
        target = url_for(endpoint, **values)
    return redirect(target)
