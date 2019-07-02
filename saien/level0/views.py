from flask import render_template, request, redirect, Blueprint, url_for, json, jsonify
from flask_login import current_user
from datetime import datetime
from sqlalchemy import exc, desc
from saien.models import Product, Notice

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


@level0.route('/news/', methods=['GET'])
def news():
    today = datetime.today()
    print(today);
    notices = Notice.query.filter(Notice.start_date <= today).order_by(desc(Notice.start_date))
    enlist = []
    for n in notices:
        enlist.append({'begin' : n.start_date.strftime('%d-%m-%Y'),
                       'title' : n.title,
                       'message' : (n.message).replace('\n', '<br>')})
    return render_template('newspage.html', notices=enlist)


@level0.route('/product/get_productInfo', methods=['POST'])
def get_productInfo():
    pid = (int)(request.form['pid'])
    retInfo = Product.query.get(pid)
    retInfo = json.dumps(retInfo.as_dict())
    return retInfo;
