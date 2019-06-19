from flask import render_template, redirect, request, Blueprint, url_for, flash, session
from flask_login import login_user, current_user, logout_user, login_required
from sqlalchemy import exc
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


@admin.route('/admin/newshop/', methods=['GET', 'POST'])
@login_required
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
        newUserInfo = Info(shop_name = form.shopname.data,
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
def admin_logout():
    logout_user()
    session.clear()
    return redirect(url_for('level0.index'))


@admin.route('/admin/search', methods=['GET'])
@login_required
@admin_login_required
def search():
    return "admin is here"
