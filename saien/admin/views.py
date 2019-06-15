from flask import render_template, redirect, request, Blueprint, url_for, flash, session
from flask_login import login_user, current_user, logout_user, login_required
from sqlalchemy import exc
from .forms import LoginForm, NewShopForm
from saien.models import *
from saien import login_manager

admin = Blueprint('admin', __name__)

@login_manager.user_loader
def load_user(admin_id):
    if admin_id is not None:
        return Admin.query.get(admin_id)
    return None

@login_manager.unauthorized_handler
def unauthorized():
    return "NO PERMISSION"


@admin.route('/admin/', methods=['GET', 'POST'])
def index():
    # If admin is authenticated transfer him/her to
    # the admin dashboard page.
    if current_user.is_authenticated:
        return redirect(url_for('admin.dashboard'))

    # If authentication is required, create a flask-wtf
    # pass it jinja2 template. 
    form = LoginForm()
    if request.method == 'POST':
        if form.validate():
            target = Admin.query.filter_by(name = str(form.username.data)).first()

            if target != None and target.check_password(str(form.password.data)):
                login_user(target)
                session.permanent = True
                session['auth_admin'] = True
                return redirect(url_for('admin.dashboard'))
            else:
                flash('Invalid credentials')
                return redirect(url_for('admin.index'), code=302)
            
    return render_template('admin_login.html',
                           form = form)


@admin.route('/admin/dashboard/', methods=['GET'])
@login_required
def dashboard():
    print ("welcome admin")
    return render_template('admin_base.html')


@admin.route('/admin/newshop/', methods=['GET', 'POST'])
@login_required
def createNewCustomerAccount():
    form = NewShopForm()
    if request.method == 'POST' and form.validate():
        newCustomer = Shop(shop_name=form.shopname.data,
                           shop_address=form.shop_address.data,
                           shop_phone=form.shop_phone.data,
                           shop_email=form.shop_email.data,
                           shop_password=form.password.data)
        newCustomer.set_password(str(form.password.data))
        db.session.add(newCustomer)
        try:
            db.session.commit()
        except exc.IntegrityError:
            flash(u'Error upon insert new Shop to database.', 'error')
            flash(u'Possible Reasons: Email address conflict (New shop and existing shop share the same Email?)'
                  , 'error')
            return redirect(url_for('admin.createNewCustomerAccount'), code=302)
        except exc.SQLAlchemyError:
            flash(u'New Shop insertion to database error!', 'error')
            return redirect(url_for('admin.createNewCustomerAccount'), code=302)

        # if no error => insertion success.
        flash(u'Account for %s is successfully created' % newCustomer.shop_name,
              'success')
        return redirect(url_for('admin.createNewCustomerAccount'), code=302)
    
    return render_template('admin_newshop.html',
                           form = form)
    


@admin.route('/admin/logout', methods=['GET'])
@login_required
def admin_logout():
    logout_user()
    session.clear()
    return redirect(url_for('level0.index'))

