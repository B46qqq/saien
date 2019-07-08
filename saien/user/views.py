from flask import render_template, redirect, request, Blueprint, url_for, flash, session, json
from flask_login import login_user, current_user, logout_user, login_required
from sqlalchemy import exc, and_, desc
from datetime import datetime, timedelta
from .forms import *
from saien.models import *
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


# Order can be made prior to 4am everyday (actually not Sundays)
@user.route('/u/makeorder/', methods=['GET'])
@login_required
@shop_login_required
def makeOrder():
    # Check if current time is before/after 4am;
    timeNow = datetime.now();
    today4am = timeNow.replace(hour=4, minute=0, second=0, microsecond=0)
    orderDate_begin = None
    if (timeNow < today4am):
        #Time is before 4am, order of today's can be arranged
        orderDate_begin = timeNow.strftime('%Y-%m-%d')
    else:
        #Time passed the expected ordering time.
        #earlies date can only be tomorrow / (not sunday)
        orderDate_begin = (timeNow + timedelta(days=1)).strftime('%Y-%m-%d')

    # Query all products in datebase
    products = Product.query.all()
    productNames = []
    product_unit = {}
    for p in products:
        productNames.append(p.product_name)
        product_unit[p.product_name] = p.availableUnit()
        
    productsData = {'productNames' : productNames}

    existingOrders = {}
    s = Shop.query.filter_by(user = current_user).first()
    v = Invoice.query.filter_by(shop_id = s.id).order_by(desc(Invoice.order_date))
    for x in v :
        existingOrders[x.getOrderDate()] = x.isDelivered(today4am)

    return render_template('user_makeorder.html',
                           min_date = orderDate_begin,
                           allProducts=productsData,
                           allProductsUnit=product_unit,
                           existOrders=existingOrders)


@user.route('/u/placeorder/', methods=['POST'])
@login_required
@shop_login_required
def placeOrder():
    r = request.json
    date = datetime.strptime(r.pop('date'), '%Y-%m-%d')

    # Assume the incoming data is correct
    # First create a new Invoice for the current_user;
    # check if invoice already exists
    invoice = Invoice.query.filter(and_(Invoice.origin_shop == current_user.info
                                        , Invoice.order_date == date)).first()
    # If order from current user already exist on that date, remove entry
    if invoice is not None:
        db.session.delete(invoice)
        db.session.commit()
        
    invoice = Invoice(order_date = date,
                         total = -999, #update total later
                         origin_shop = current_user.info)
    totalCost = 0
    allInvoiceItems = []
    
    for order in r:
        o = r[order]
        product = Product.query.filter_by(product_name = o['pname']).first()
        calcPrice = product.priceByUnit(o['unit'], float(o['quantity']))
        totalCost += calcPrice
        ii = InvoiceItem(unit = o['unit'],
                         quantity = float(o['quantity']) * 10,
                         price = calcPrice,
                         origin_product = product,
                         origin_invoice = invoice)

    invoice.setTotal(totalCost)
    db.session.add(invoice)
    db.session.add_all(allInvoiceItems)
    try:
        db.session.commit()
    except:
        return json.dumps({'error' : 'Cannot update database!'})
    
    return json.dumps({'success' : 'Order successfully received'})


@user.route('/u/vieworder/', methods=['POST'])
@login_required
@shop_login_required
def viewOrder():
    orderDate = datetime.strptime(request.form['date'], '%d, %B, %Y\t%A')
#    print (current_user.info.getInvoiceTable(orderDate))
    ret = {}
    ret['column'] = ['Product', 'Amount', 'Total']
    ret['rows'] = current_user.info.getInvoiceTable(orderDate)
    return json.dumps(ret)


@user.route('/u/copyorder/', methods=['POST'])
@login_required
@shop_login_required
def copyOrder():
    orderDate = datetime.strptime(request.form['date'], '%d, %B, %Y\t%A')
    ret = {}
    ret['orders'] = current_user.info.getInvoiceList(orderDate)
    print(ret)
    return json.dumps(ret)

@user.route('/u/logout')
@login_required
@shop_login_required
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
