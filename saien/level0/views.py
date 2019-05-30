from flask import render_template, Blueprint

level0 = Blueprint('level0', __name__)

@level0.route('/')
def index():
    return render_template('base_bg_sb.html')

@level0.route('/login')
def login():
    return render_template('login.html')
