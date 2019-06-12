from flask import render_template, Blueprint, session, redirect, url_for

level0 = Blueprint('level0', __name__)

@level0.route('/')
def index():
    return render_template('level0_base.html')

@level0.route('/login')
def login():
    return render_template('login.html')

@level0.route('/reset')
def reset():
    session['logged_in'] = None;
    return redirect(url_for('level0.index'));
