from flask import render_template, request, redirect, Blueprint, url_for, json, jsonify
from flask_login import current_user
from sqlalchemy import exc
from saien.models import Product

level0 = Blueprint('level0', __name__)

@level0.route('/')
def index():
    return render_template('level0_base.html')

@level0.route('/search/')
def search():
    products = Product.query.all()
    plist = []
    for p in products:
        plist.append(p.as_dict())
    return render_template('searchpage.html')


