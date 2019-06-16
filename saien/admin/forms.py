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
    shopname = StringField('Shop Name', [DataRequired()])
    password = PasswordField('Confirm Password', [DataRequired(),
                                          EqualTo('confirm', message="Passwords must match!")])
    confirm = PasswordField('Password')
    shop_address = StringField('Shop Address', [DataRequired()])
    shop_phone = StringField('Shop Phone Number (optional)')
    shop_email = StringField('Shop Email', [DataRequired()])
    register = SubmitField('Register')
    
