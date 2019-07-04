from flask import render_template, redirect, request, Blueprint, url_for, flash, session, json
from flask_login import login_user, current_user, logout_user, login_required
from sqlalchemy import exc
from datetime import datetime, timedelta
from .forms import *
from saien.models import User, Product
from urllib.parse import urlparse, urljoin
from saien.util.access_protocol import shop_login_required

user = Blueprint('user', __name__)

@user.route('/u/verify', methods=['POST'])
def verify():
    if current_user.is_authenticated and current_user.is_shop():
        return redirect(url_for('user.index'))
    
    target = User.query.filter_by(email = str(request.form['email'])).first()
    retURL = get_redirect_target()

    if target != None and target.check_password(str(request.form['password'])):
        print (target)
        if current_user is not None:
            logout_user()
        login_user(target)
        return redirect(url_for('user.index'))
    else:
        flash (u'Login unsuccessful')
        if retURL is not None:
            return redirect(retURL)
        else:
            return redirect(url_for('level0.index'))


@user.route('/u/', methods=['GET'])
@login_required
@shop_login_required
def index():
    return render_template('user_base.html')


@user.route('/u/makeorder/', methods=['GET'])
@login_required
@shop_login_required
def makeOrder():
    dateToday = datetime.today().strftime('%Y-%m-%d')
    products = Product.query.all()
    productNames = []
    for p in products:
        productNames.append(p.product_name)
    productsData = {'productNames' : productNames}
    return render_template('user_makeorder.html',
                           min_date = dateToday,
                           allProducts=productsData)


@user.route('/u/logout')
@login_required
def logout():
    logout_user()
    session.clear()
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
