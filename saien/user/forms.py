from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email

class UserLoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired('Please enter Email for login.'),
                                             Email('Please enter an valid Email address')])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('log in')
