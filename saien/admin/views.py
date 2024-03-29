from flask import render_template, redirect, request, Blueprint, url_for, flash, session, json
from flask_login import login_user, current_user, logout_user, login_required
from sqlalchemy import exc, desc
from datetime import datetime, timedelta
from .forms import LoginForm, NewShopForm
from saien.models import *
from saien.util.access_protocol import *

admin = Blueprint('admin', __name__)

@admin.route('/admin/', methods=['GET', 'POST'])
def index():
    # If admin is authenticated transfer him/her to
    # the admin dashboard page.
    if current_user.is_authenticated and current_user.is_admin():
        return redirect(url_for('admin.dashboard'))

    # If authentication is required, create a flask-wtf
    # pass it jinja2 template. 
    form = LoginForm()
    if request.method == 'POST':
        if form.validate():
            target = User.query.filter_by(username = str(form.username.data)).first()
            if target != None and target.check_password(str(form.password.data)):
                login_user(target)
                session.permanent = True
                return redirect(url_for('admin.dashboard'))
            else:
                flash('Invalid credentials')
                return redirect(url_for('admin.index'), code=302)
            
    return render_template('admin_login.html',
                           form = form)


@admin.route('/admin/dashboard/', methods=['GET'])
@login_required
@admin_login_required
def dashboard():
    return render_template('admin_base.html')

# Product management page allow admins to update products within the
# company. Update actions include add or remove product from the
# base.
@admin.route('/admin/productmanagement/', methods=['GET'])
@login_required
@admin_login_required
def productManagement():
    products = Product.query.all()
    plist = []
    for p in products:
        plist.append({"id" : p.product_id,
                      "name" : p.product_name})
    return render_template('admin_productmanagement.html', plist=plist)

@admin.route('/admin/noticemanagement/', methods=['GET'])
@login_required
@admin_login_required
def noticeManagement():
    dateToday = datetime.today().strftime('%Y-%m-%d')
    dateTmr = (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d')
    # Query for existing notices, for better management.
    existingNotice = Notice.query.filter().order_by(desc(Notice.start_date))
    enlist = []
    for n in existingNotice:
        enlist.append({'id' : n.id,
                       'begin' : n.start_date.strftime('%d-%m-%Y'),
                       'expire' : n.expire_date.strftime('%d-%m-%Y')
                       if n.expire_date is not None else 'UNSET',
                       'title' : n.title,
                       'message' : (n.message).replace('\n', '<br>')})
    return render_template('admin_noticemanagement.html',
                           min_date = dateToday,
                           tmr_date = dateTmr,
                           old_notice = enlist)


@admin.route('/admin/createnotice/', methods=['POST'])
@login_required
@admin_login_required
def createNotice():
    dateBegin = request.form['begin']
    dateExpire = request.form['expire']

    if dateBegin is not None and dateBegin is not '':
        dateBegin = datetime.strptime(dateBegin, '%Y-%m-%d')
    else:
        dateBegin = datetime.today()
    if dateExpire is not None and dateExpire is not '':
        dateExpire = datetime.strptime(dateExpire, '%Y-%m-%d')
    else:
        dateExpire = None
        
    title = str(request.form['title'])
    message = str(request.form['message'])
    # Current there is no difference between important notice and
    # normal notice. Not sure how this variable will become important
    # later on.
    important = False

    newPost = Notice(dateBegin, dateExpire, title, message, important)
    db.session.add(newPost)
    try:
        db.session.commit()
    except:
        flash('Datebase commit failed! Please retry', 'error')
        
    flash ('Notice posted correctly', 'success')
    return redirect(url_for('admin.noticeManagement'))



@admin.route('/admin/removenotice/', methods=['POST'])
@login_required
@admin_login_required
def removeNotice():
    try:
        delete_target = Notice.query.get((int)(request.form['id']))
        db.session.delete(delete_target)
        db.session.commit()
    except:
        return json.dumps({'error' : 'Deletion Failed; database not accepting requests.'})
    return json.dumps({'success' : 'Notice Deleted!'})



@admin.route('/admin/productmanagement/pnew', methods=['POST'])
@login_required
@admin_login_required
def productNew():
    newpname = str(request.form['pname'])
    new_target = Product(product_name=newpname);
    db.session.add(new_target)
    db.session.commit()
    return str(new_target.product_id)



@admin.route('/admin/productmanagement/pupdate', methods=['POST'])
@login_required
@admin_login_required
def productUpdate():
    data = request.form;
    update_target = Product.query.get((int)(data['pid']))
    
    # Do nothing but return error message when product_name is none;
    if str(data['pname']) is None or str(data['pname']) is '':
        return json.dumps({'error' : 'Update Failed; product name cannot be none.'})
    
    update_target.product_name = str(data['pname'])
    update_target.product_description = str(data['pdes'])
    update_target.price_unit_pc = (float)(data['pppc']) * 100
    update_target.price_unit_kg = (float)(data['ppkg']) * 100
    update_target.price_unit_box = (float)(data['ppbox']) * 100
    try:
        db.session.commit()
    except:
        return json.dumps({'error' : 'Update Failed; database not accepting requests.'})
    return json.dumps({'success' : 'Update Success'})



@admin.route('/admin/productmanagement/pdelete', methods=['POST'])
@login_required
@admin_login_required
def productDelete():
    try:
        delete_target = Product.query.get((int)(request.form['pid']))
        db.session.delete(delete_target)
        db.session.commit()
    except:
        return json.dumps({'error' : 'Deletion Failed; database not accepting requests.'})
    return json.dumps({'success' : 'Product Deleted!'})



@admin.route('/admin/newshop/', methods=['GET', 'POST'])
@login_required
@admin_login_required
def createNewCustomerAccount():
    form = NewShopForm()
    if request.method == 'POST' and form.validate():
        # Creation of customer account includes two step
        # 1. Create User instance,
        # 2. Create Info instance with User.id
        newUser = User(email = form.shop_email.data,
                       username = str(form.shop_email.data).split('@')[0],
                       password = form.password.data)
        shopRole = Role.query.filter_by(name = 'shop').first()
        newUserInfo = Shop(shop_name = form.shopname.data,
                           shop_address = form.shop_address.data,
                           shop_phone = form.shop_phone.data,
                           shop_email = form.shop_email.data,
                           user = newUser)
        
        newUser.set_password(str(form.password.data))
        newUser.roles.append(shopRole)
        db.session.add_all([newUser, newUserInfo])

        # Display error message upon insertion to database
        try:
            db.session.commit()
        except exc.IntegrityError:
            flash(u'Error upon insert new Shop to database.', 'error')
            flash(u'Possible Reasons: Email address conflict'\
                  '(New shop and existing shop share the same Email?)'
                  , 'error')
            return redirect(url_for('admin.createNewCustomerAccount'), code=302)
        except exc.SQLAlchemyError as e:
            print(e)
            flash(u'New Shop insertion to database error!', 'error')
            return redirect(url_for('admin.createNewCustomerAccount'), code=302)

        # if no error => insertion success.
        flash(u'Account for %s is successfully created' % newUser.email,
              'success')
        return redirect(url_for('admin.createNewCustomerAccount'), code=302)
    
    return render_template('admin_newshop.html',
                           form = form)
    


@admin.route('/admin/logout', methods=['GET'])
@login_required
@admin_login_required
def admin_logout():
    logout_user()
    session.clear()
    return redirect(url_for('level0.index'))
