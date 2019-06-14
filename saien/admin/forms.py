from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, EqualTo, InputRequired

class LoginForm(FlaskForm):
    # Upon login failure, only error message will be displayed
    # is : login failed
    username = StringField('Username', [DataRequired()])
    password = PasswordField('Password', [DataRequired()])
    submit = SubmitField('log in')


class NewShopForm(FlaskForm):
    shopname = StringField('Username', [InputRequired()])
    password = PasswordField('Password', [DataRequired(),
                                          EqualTo('confirm', message="Passwords must match")])
    confirm = PasswordField('Repeat Password')
    shop_address = StringField('Address', [DataRequired()])
    shop_phone = StringField('Phone')
    shop_email = StringField('Email', [DataRequired()])
    register = SubmitField('Register')
    
