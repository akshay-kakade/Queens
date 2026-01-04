from flask import Blueprint, jsonify, request
from app.models import Tenant, Product, User, CustomerProfile, Wishlist, Order, OrderItem
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
import datetime

bp = Blueprint('customer', __name__, url_prefix='/customer')

# ... existing routes ...

@bp.route('/orders', methods=['POST'])
@jwt_required()
def place_order():
    current_user_id = get_jwt_identity()
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id

    data = request.get_json()
    items = data.get('items', [])
    delivery_info = data.get('delivery_info', {})
    
    if not items:
        return jsonify({"message": "Order items required"}), 400

    # Parse delivery time
    delivery_time_str = delivery_info.get('delivery_time')
    delivery_time = None
    if delivery_time_str:
        try:
            delivery_time = datetime.datetime.fromisoformat(delivery_time_str.replace('Z', '+00:00'))
        except:
            pass

    new_order = Order(
        user_id=user_id, 
        total_amount=0, 
        status='Pending',
        delivery_address=delivery_info.get('address'),
        contact_number=delivery_info.get('contact'),
        delivery_time=delivery_time
    )
    db.session.add(new_order)
    db.session.flush()

    total_amount = 0

    for item in items:
        product = Product.query.get(item['id'])
        if product:
            quantity = item.get('quantity', 1)
            line_total = product.price * quantity
            total_amount += line_total
            
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=product.id,
                quantity=quantity,
                price_at_purchase=product.price
            )
            db.session.add(order_item)
            
            # Stock mgmt
            if product.stock >= quantity:
                product.stock -= quantity
                
            # Revenue Calculation: Credit Tenant
            if product.tenant:
                product.tenant.account_balance += line_total

    new_order.total_amount = total_amount
    
    # Loyalty & Tier Logic
    user = User.query.get(user_id)
    if user.customer_profile:
        # 1 point per $1
        points_earned = int(total_amount)
        user.customer_profile.loyalty_points += points_earned
        
        # Tier Upgrades
        pts = user.customer_profile.loyalty_points
        if pts >= 1500:
            user.customer_profile.tier = 'Gold'
        elif pts >= 500:
            user.customer_profile.tier = 'Silver'
        else:
            user.customer_profile.tier = 'Bronze'
    
    db.session.commit()
    return jsonify({"message": "Order placed successfully", "order_id": new_order.id}), 201

@bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    current_user_id = get_jwt_identity()
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id
        
    # Order Expiry logic: 
    # If delivery_time < now and status is Pending -> Expired
    now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None) # naive comparison
    pending_orders = Order.query.filter_by(user_id=user_id, status='Pending').all()
    for order in pending_orders:
        if order.delivery_time and order.delivery_time < now:
            order.status = 'Expired'
            # Optional: Refund logic? The user didn't specify, but usually cleanup means restocking
            # For now, just mark Expired as requested.
            db.session.add(order)
    
    if pending_orders:
        db.session.commit()

    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders]), 200

@bp.route('/shops', methods=['GET'])
def get_shops():
    shops = Tenant.query.filter_by(is_approved=True).all()
    # Serialize manually or add to_dict to Tenant model
    return jsonify([shop.to_dict() for shop in shops]), 200

@bp.route('/shops/<int:tenant_id>', methods=['GET'])
def get_shop_details(tenant_id):
    shop = Tenant.query.get_or_404(tenant_id)
    return jsonify(shop.to_dict()), 200

@bp.route('/shops/<int:tenant_id>/products', methods=['GET'])
def get_shop_products(tenant_id):
    products = Product.query.filter_by(tenant_id=tenant_id).all()
    return jsonify([p.to_dict() for p in products]), 200

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id

    user = User.query.get(int(user_id))
    
    if not user.customer_profile:
        # Create default profile if missing
        profile = CustomerProfile(user_id=user.id, loyalty_points=120) # Mock points for now
        db.session.add(profile)
        db.session.commit()
    else:
        profile = user.customer_profile
        
    return jsonify({
        "username": user.username,
        "email": user.email,
        "loyalty_points": profile.loyalty_points,
        "tier": profile.tier,
        "joined_at": profile.joined_at.isoformat()
    }), 200

@bp.route('/wishlist', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
def manage_wishlist():
    current_user_id = get_jwt_identity()
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id

    if request.method == 'GET':
        wishlist_items = Wishlist.query.filter_by(user_id=user_id).all()
        # Return full product details
        return jsonify([item.product.to_dict() for item in wishlist_items]), 200

    data = request.get_json()
    product_id = data.get('product_id')
    if not product_id:
        return jsonify({"message": "Product ID required"}), 400

    if request.method == 'POST':
        # Check if already exists
        exists = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
        if exists:
            return jsonify({"message": "Already in wishlist"}), 200
            
        new_item = Wishlist(user_id=user_id, product_id=product_id)
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Added to wishlist"}), 201

    if request.method == 'DELETE':
        item = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
        if item:
            db.session.delete(item)
            db.session.commit()
        return jsonify({"message": "Removed from wishlist"}), 200
