from flask import render_template, redirect, request, Blueprint

user = Blueprint('user', __name__)

@user.route('/u/verify', methods=['POST'])
def verify():
    postedValue = request.form
    print (postedValue)
    return "got it"
