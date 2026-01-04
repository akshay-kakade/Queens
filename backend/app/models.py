from app import db
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = 'admin'
    TENANT = 'tenant'
    CUSTOMER = 'customer'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True, nullable=False)
    email = db.Column(db.String(120), unique=True, index=True, nullable=False)
    password_hash = db.Column(db.String(255))
    role = db.Column(db.String(20), default=UserRole.CUSTOMER.value)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    tenant_profile = db.relationship('Tenant', backref='user', uselist=False)
    customer_profile = db.relationship('CustomerProfile', backref='user', uselist=False)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
        }

class Tenant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    shop_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50))
    shop_number = db.Column(db.String(20))
    image_url = db.Column(db.String(500)) # URL to shop image
    description = db.Column(db.Text)      # Shop description
    account_balance = db.Column(db.Float, default=0.0) # New: For revenue tracking
    is_approved = db.Column(db.Boolean, default=False)
    
    products = db.relationship('Product', backref='tenant', lazy='dynamic')
    events = db.relationship('Event', backref='tenant', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'shop_name': self.shop_name,
            'category': self.category,
            'shop_number': self.shop_number,
            'image_url': self.image_url,
            'description': self.description,
            'account_balance': self.account_balance,
            'is_approved': self.is_approved
        }

# ... (skipped CustomerProfile, Product, Event, Wishlist) ...

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Pending') # Pending, Completed, Cancelled
    
    # Delivery Details
    delivery_address = db.Column(db.String(255), nullable=True)
    contact_number = db.Column(db.String(100), nullable=True)
    delivery_time = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    items = db.relationship('OrderItem', backref='order', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'total_amount': self.total_amount,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'item_count': len(self.items),
            'delivery_address': self.delivery_address,
            'contact_number': self.contact_number,
            'delivery_time': self.delivery_time.isoformat() if self.delivery_time else None
        }

class CustomerProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    loyalty_points = db.Column(db.Integer, default=0)
    tier = db.Column(db.String(20), default='Bronze')
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'loyalty_points': self.loyalty_points,
            'tier': self.tier,
            'joined_at': self.joined_at.isoformat()
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'stock': self.stock,
            'image_url': self.image_url,
            'tenant_id': self.tenant_id
        }

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.DateTime, nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=True) # Nullable if mall-wide event
    image_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'date': self.date.isoformat(),
            'tenant_id': self.tenant_id,
            'image_url': self.image_url
        }

class Wishlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    
    product = db.relationship('Product')



class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_purchase = db.Column(db.Float, nullable=False)
    
    product = db.relationship('Product')

    def to_dict(self):
        return {
            'product_name': self.product.name,
            'quantity': self.quantity,
            'price': self.price_at_purchase
        }
