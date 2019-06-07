from saien import db, bcrypt
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property

shopContacts = db.Table('shopcontacts',
                        db.Column('shop_id', db.Integer, db.ForeignKey('shop.shop_id')),
                        db.Column('contact_id', db.Integer, db.ForeignKey('contactperson.cp_id')),
)

class Admin(db.Model):
    __tablename__ = 'admin'

    admin_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(31), nullable = False)
    password = db.Column(db.String(127), nullable = False)

    @property
    def is_authenticated(self):
        return self.admin_id

    @property
    def is_active(self):
        return True
    
    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.admin_id)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)    

    def __repr__(self):
        returnStr = str('Admin name: %s\n') % (self.name)
        return returnStr

    
class Shop(db.Model):
    __tablename__ = 'shop'
    
    shop_id = db.Column(db.Integer, primary_key = True)
    shop_name = db.Column(db.String(63), nullable = False)
    shop_address = db.Column(db.String(255), nullable = False)
    shop_phone = db.Column(db.String(15))
    shop_email = db.Column(db.String(63), nullable = False, unique = True)
    shop_password = db.Column(db.String(32), nullable = False)
    shop_auth = db.Column(db.Boolean, default = False)
    
    invoices = db.relationship('Invoice', backref='origin_shop')
    contacts = db.relationship('ContactPerson',
                               secondary = shopContacts,
                               lazy = 'subquery',
                               backref = db.backref('shop', lazy = True))
    
    @property
    def is_authenticated(self):
        return self.shop_auth

    @property
    def is_active(self):
        return True
    
    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.shop_id)

    def set_password(self, password):
        self.shop_password = bcrypt.generate_password(password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.shop_password, password)
        
    def __repr__(self):
        returnStr = str('Shop name: %s\nLocation: %s\n') % (self.shop_name, self.shop_address)
        if (self.shop_phone is not None):
            returnStr += str('Phone: %s\n') % (self.shop_phone)

        return returnStr
    
class ContactPerson(db.Model):
    __tablename__ = 'contactperson'
    
    cp_id = db.Column(db.Integer, primary_key = True)
    cp_name = db.Column(db.String(31), nullable = False)
    cp_phone = db.Column(db.String(15), nullable = False)

    def __repr__(self):
        returnStr = str('Contact person\'s name: %s\nContact person\'s phone" %s\n') % (self.cp_name, self.cp_phone)
        return returnStr
    
class Invoice(db.Model):
    __tablename__ = 'invoice'
    
    invoice_id = db.Column(db.Integer, primary_key = True)
    order_date = db.Column(db.DateTime, nullable = False, default = datetime.utcnow)
    total = db.Column(db.Integer, nullable = False)

    shop_id = db.Column(db.Integer, db.ForeignKey('shop.shop_id'))
    items = db.relationship('InvoiceItem', backref='origin_invoice')

    def __repr__(self):
        returnStr = str('Invoice date: %s\nTotal (AUD): $%s\n') % (self.order_date.strftime('%d/%m/%Y'), str(self.total/100))
        return returnStr
    

class Product(db.Model):
    __tablename__ = 'product'

    product_id = db.Column(db.Integer, primary_key = True)
    product_name = db.Column(db.String(63), nullable = False)
    product_description = db.Column(db.String(511))
    price_unit_kg = db.Column(db.Integer)
    price_unit_box = db.Column(db.Integer)

    invoiceitems = db.relationship('InvoiceItem', backref='origin_product')

    def __repr__(self):
        returnStr = str('Product name: %s\n') % (self.product_name)
        if (self.product_id is not None):
            returnStr = str('Product ID: %s\n') % (self.product_id) + returnStr
        if (self.product_description is not None):
            returnStr += str('Description: %s\n') % (self.product_description)
        if (self.price_unit_kg is not None):
            returnStr += str('Price (KG): $%s\n') % (str(self.price_unit_kg / 100))
        if (self.price_unit_box is not None):
            returnStr += str('Price (Box): $%s\n') % (str(self.price_unit_box / 100))
        return returnStr

# Line_item
class InvoiceItem(db.Model):
    __tablename__ = 'invoiceitem'

    invoiceitem_id = db.Column(db.Integer, primary_key = True)
    invoiceitem_unit = db.Column(db.String(3), nullable = False) # BOX OR KG
    invoiceitem_quantity = db.Column(db.Integer, nullable = False)
    invoiceitem_price = db.Column(db.Integer, nullable = False)

    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    invoice = db.Column(db.Integer, db.ForeignKey('invoice.invoice_id'))

    def __repr__(self):
        returnStr = str('Invoice item quantity: %s\n') % (str(self.invoiceitem_quantity / 10))
        returnStr += str('Invoice item unit: %s\n') % (str(self.invoiceitem_unit).lower())
        returnStr += str('Inovice item price: %s\n') % (str(self.invoiceitem_price / 100))

        return returnStr

