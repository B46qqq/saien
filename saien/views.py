from saien import app
from flask import render_template

@app.route('/')
def index():
    return render_template('base_bg_sb.html')
