from flask import render_template, request, redirect, Blueprint, url_for, json, jsonify
from flask_login import current_user
from sqlalchemy import exc
from saien.models import Product

level0 = Blueprint('level0', __name__)

@level0.route('/')
def index():
    return render_template('level0_base.html')

@level0.route('/redirectsearch')
def redirectSearch():
    if current_user.is_anonymous:
        return redirect(url_for('level0.search'))
    elif current_user.is_shop():
        return redirect(url_for('user.search'))
    return redirect(url_for('admin.search'))


    products = Product.query.all()
    plist = []
    for p in products:
        plist.append(p.as_dict())
    return render_template('common_search.html', plist=plist)

@level0.route('/search')
def search():
    return 'hello world'

@level0.route('/ajax/search_content', methods=['POST'])
def get_searchContent():
    return render_template('common_search.html')

@level0.route('/search/ajaxurl', methods=['POST'])
def searchItem_ajax():
    print (request.form['justname'])
    return "hi there"


