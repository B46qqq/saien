from saien import db, bcrypt
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property

shopContacts = db.Table('shopcontacts',
                        db.Column('shop_id', db.Integer, db.ForeignKey('shop.id')),
                        db.Column('contact_id', db.Integer, db.ForeignKey('contactperson.cp_id')),
)

userRoles = db.Table('userRoles',
                     db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
                     db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True))

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(63), nullable = False)
    username = db.Column(db.String(31), nullable = False)
    password = db.Column(db.String(127), nullable = False)
    roles = db.relationship('Role', secondary=userRoles,
                            backref=db.backref('users', lazy=True))
    info = db.relationship('Shop', uselist=False, backref='user')
    
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True
    
    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    def is_admin(self):
        admin = Role.query.filter_by(name = 'admin').first()
        if admin is None:
            print ('DATABASE ERROR!')
            print ('Role table has error!. Further Request will not be processed')
            return None;
        for r in self.roles:
            if r == admin:
                return True
        return False

    def is_shop(self):
        shop = Role.query.filter_by(name = 'shop').first()
        if shop is None:
            print ('DATABASE ERROR!')
            print ('Role table is error!. Further Request will not be processed')
            return None;
        for r in self.roles:
            if r == shop:
                return True
        return False        

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)    

    def __repr__(self):
        returnStr = str('Account name: %s\n') % (self.username)
        return returnStr

    
class Role(db.Model):
    __tablename__ = 'role'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(31), unique = True)


class Shop(db.Model):
    __tablename__ = 'shop'

    id = db.Column(db.Integer, primary_key = True)
    shop_name = db.Column(db.String(63), nullable = False)
    shop_address = db.Column(db.String(255), nullable = False)
    shop_phone = db.Column(db.String(15))
    shop_email = db.Column(db.String(63), nullable = False, unique = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    invoices = db.relationship('Invoice', backref='origin_shop')
 
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
    order_date = db.Column(db.DateTime, unique = True, nullable = False, default = datetime.utcnow)
    total = db.Column(db.Integer, nullable = False)

    shop_id = db.Column(db.Integer, db.ForeignKey('shop.id'))
    items = db.relationship('InvoiceItem', backref='origin_invoice', cascade="delete")

    def setTotal(self, total):
        self.total = total

    def __repr__(self):
        returnStr = str('Invoice date: %s\nTotal (AUD): $%s\n') % (self.order_date.strftime('%d/%m/%Y'), str(self.total/100))
        return returnStr
    

class Product(db.Model):
    __tablename__ = 'product'

    product_id = db.Column(db.Integer, primary_key = True)
    product_name = db.Column(db.String(63), nullable = False)
    product_description = db.Column(db.String(511))
    price_unit_pc = db.Column(db.Integer)
    price_unit_kg = db.Column(db.Integer)
    price_unit_box = db.Column(db.Integer)
    
    invoiceitems = db.relationship('InvoiceItem', backref='origin_product')

    
    def priceByUnit(self, unit, quantity):
        if unit.upper() == 'KG':
            return self.price_unit_kg * quantity
        if unit.upper() == 'BOX':
            return self.price_unit_box * quantity

        
    def availableUnit(self):
        ret = []
        if (self.price_unit_pc is not None):
            ret.append('pc')
        if (self.price_unit_kg is not None):
            ret.append('kg')
        if (self.price_unit_box is not None):
            ret.append('box')

        return ret
    
        
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

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

    id = db.Column(db.Integer, primary_key = True)
    unit = db.Column(db.String(3), nullable = False) # BOX or KG or PIECE
    quantity = db.Column(db.Integer, nullable = False)
    price = db.Column(db.Integer, nullable = False)

    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoice.invoice_id'))

    def __repr__(self):
        returnStr = str('Invoice item quantity: %s\n') % (str(self.quantity / 10))
        returnStr += str('Invoice item unit: %s\n') % (str(self.unit).upper())
        returnStr += str('Inovice item price: $%s\n') % (str(self.price / 100))

        return returnStr

class Notice(db.Model):
    __tablename__ = 'notice'

    id = db.Column(db.Integer, primary_key = True)
    start_date = db.Column(db.DateTime, default = datetime.utcnow)
    expire_date = db.Column(db.DateTime, nullable = True)
    title = db.Column(db.String(120), nullable = False)
    message = db.Column(db.String(2048), nullable = False)
    important = db.Column(db.Boolean, default = False)

    def __init__(self, begin, expire, title, message, important):
        self.start_date = begin
        self.title = title
        self.message = message
        self.expire_date = expire
        self.important = important

    def __repr__(self):
        returnStr = str('Start date : %s\n') % self.start_date.strftime('%d-%B-%Y')
        if self.expire_date is not None:
            returnStr += str('Expire date : %s\n') % self.expire_date.strftime('%d-%B-%Y')
        returnStr += str('Title : %s\n') % self.title
        returnStr += str('Message : %s\n') % self.message
        
        return returnStr
    

##############################################################
# Avoid circular imports, not the ideal solution but no time #
##############################################################
from saien.util.login_manager import *    


def db_restart():
    roleAdmin = Role(name = 'admin')
    roleShop = Role(name = 'shop')
    admin = User(email='admin@saien.com',
                 username='admin',
                 password='iamadmin')
    admin.set_password(admin.password)
    admin.roles.append(roleAdmin)
    db.session.add_all([roleAdmin, roleShop, admin])
    db.session.commit()

def db_init_product():
    # Only listing a few vegtable / fruit for teting
    # a = Product(product_name='a')
    asparagus = Product(product_name='asparagus', price_unit_kg='1000')
    avocado = Product(product_name='avocado', price_unit_kg='900')
    beetroot = Product(product_name='beetroot', price_unit_kg='1300')
    broccoli = Product(product_name='broccoli')
    db.session.add_all([asparagus, avocado, beetroot, broccoli])
    db.session.commit()
