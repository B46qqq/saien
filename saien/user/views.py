from flask import render_template, redirect, request, Blueprint

user = Blueprint('user', __name__)

@user.route('/u/login')
def user_login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != '
