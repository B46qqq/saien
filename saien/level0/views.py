from flask import render_template, request, redirect, Blueprint, url_for, json, jsonify
from flask_login import current_user
from sqlalchemy import exc
from saien.models import Product

level0 = Blueprint('level0', __name__)

@level0.route('/')
def index():
    return render_template('level0_base.html')

@level0.route('/search/', methods=['GET'])
def search():
    products = Product.query.all()
    plist = []
    for p in products:
        plist.append({"id" : p.product_id,
                      "name" : p.product_name})
        
    return render_template('searchpage.html', plist=plist)


