from flask import render_template, Blueprint

admin = Blueprint('admin', __name__)

@admin.route('/admin')
def management():
    return render_template('base_bg_sb.html')
