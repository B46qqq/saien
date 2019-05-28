from flask import current_app
from saien import db

class Shop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    shop_name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return str("hi " + self.shop_name)
    
