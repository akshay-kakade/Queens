from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Product, Tenant, User, UserRole
from app import db

bp = Blueprint('tenant', __name__, url_prefix='/tenant')

def get_current_tenant():
    user_id = get_jwt_identity()  # Now returns string user ID
    user = User.query.get(int(user_id))
    
    # Auto-create tenant profile if missing (for demo purposes)
    if not user.tenant_profile:
        tenant = Tenant(user_id=user.id, shop_name=f"{user.username}'s Shop", category="General")
        db.session.add(tenant)
        db.session.commit()
        return tenant
    
    return user.tenant_profile

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    current_user_id = get_jwt_identity() 
    # Handle string or dict ID
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id
        
    user = User.query.get(int(user_id))
    tenant = user.tenant_profile
    if not tenant:
        return jsonify({"message": "Tenant profile not found"}), 404
        
    product_count = Product.query.filter_by(tenant_id=tenant.id).count()
    # Mock sales data for now
    total_sales = 5000 
    
    return jsonify({
        "shop_name": tenant.shop_name,
        "image_url": tenant.image_url,
        "description": tenant.description,
        "category": tenant.category,
        "total_products": product_count,
        "total_sales": total_sales
    }), 200

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id

    user = User.query.get(int(user_id))
    tenant = get_current_tenant() # Use helper
    if not tenant:
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json()
    
    if 'shop_name' in data:
        tenant.shop_name = data['shop_name']
    if 'description' in data:
        tenant.description = data['description']
    if 'image_url' in data:
        tenant.image_url = data['image_url']
    if 'category' in data:
        tenant.category = data['category']
        
    db.session.commit()
    return jsonify(tenant.to_dict()), 200

@bp.route('/products', methods=['GET'])
@jwt_required()
def get_products():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user.tenant_profile:
        return jsonify([]), 200
        
    products = Product.query.filter_by(tenant_id=user.tenant_profile.id).all()
    return jsonify([p.to_dict() for p in products]), 200

@bp.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    try:
        tenant = get_current_tenant()
        if not tenant:
            return jsonify({"message": "Unauthorized"}), 403
        
        if not tenant.is_approved:
            return jsonify({"message": "Shop not approved. Please contact admin."}), 403

        data = request.get_json()
        print(f"Received data: {data}")
        
        new_product = Product(
            tenant_id=tenant.id,
            name=data['name'],
            description=data.get('description', ''),
            price=float(data['price']),
            stock=int(data['stock']),
            image_url=data.get('image_url', '')
        )
        db.session.add(new_product)
        db.session.commit()
        print(f"Product created: {new_product.to_dict()}")
        return jsonify(new_product.to_dict()), 201
    except Exception as e:
        import traceback
        print(f"Error adding product: {e}")
        traceback.print_exc()
        return jsonify({"message": f"Failed to add product: {str(e)}"}), 500

@bp.route('/products/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    tenant = get_current_tenant()
    if not tenant:
        return jsonify({"message": "Unauthorized"}), 403
    
    product = Product.query.filter_by(id=id, tenant_id=tenant.id).first_or_404()
    data = request.get_json()
    
    try:
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = float(data.get('price', product.price))
        product.stock = int(data.get('stock', product.stock))
        product.image_url = data.get('image_url', product.image_url)
        
        db.session.commit()
        return jsonify(product.to_dict()), 200
    except Exception as e:
        print(f"Error updating product: {e}")
        return jsonify({"message": "Failed to update product"}), 500

@bp.route('/products/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    tenant = get_current_tenant()
    if not tenant:
        return jsonify({"message": "Unauthorized"}), 403
    
    product = Product.query.filter_by(id=id, tenant_id=tenant.id).first_or_404()
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({"message": "Product deleted"}), 200

@bp.route('/orders', methods=['GET'])
@jwt_required()
def get_tenant_orders():
    current_user_id = get_jwt_identity()
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id

    tenant = Tenant.query.filter_by(user_id=user_id).first()
    if not tenant:
        return jsonify({"message": "Tenant not found"}), 404
    
    from app.models import Order, OrderItem, Product
    import datetime
    
    # Expiry Check
    now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    
    # join Order -> OrderItem -> Product
    results = db.session.query(Order, OrderItem, Product)\
        .join(OrderItem, OrderItem.order_id == Order.id)\
        .join(Product, OrderItem.product_id == Product.id)\
        .filter(Product.tenant_id == tenant.id)\
        .order_by(Order.created_at.desc())\
        .all()
        
    orders_map = {}
    for order, item, prod in results:
        # Check for expiry on the fly
        if order.status == 'Pending' and order.delivery_time and order.delivery_time < now:
            order.status = 'Expired'
            db.session.add(order)
            db.session.commit() # Commit each to avoid session conflicts in this specific query loop

        if order.id not in orders_map:
            orders_map[order.id] = {
                'id': order.id,
                'customer_id': order.user_id,
                'date': order.created_at.isoformat(),
                'status': order.status,
                'delivery_address': order.delivery_address,
                'contact_number': order.contact_number,
                'delivery_time': order.delivery_time.isoformat() if order.delivery_time else None,
                'items': [],
                'total_revenue': 0
            }
        
        line_total = item.price_at_purchase * item.quantity
        orders_map[order.id]['items'].append({
            'product_name': prod.name,
            'quantity': item.quantity,
            'price': item.price_at_purchase,
            'total': line_total
        })
        orders_map[order.id]['total_revenue'] += line_total

    return jsonify(list(orders_map.values())), 200

@bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    current_user_id = get_jwt_identity()
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id

    tenant = Tenant.query.filter_by(user_id=user_id).first()
    if not tenant:
        return jsonify({"message": "Tenant not found"}), 404

    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ['Completed', 'Cancelled']:
        return jsonify({"message": "Invalid status"}), 400

    from app.models import Order, OrderItem, Product
    
    # Verify the order contains a product from this tenant
    # Using double quotes for "order" because it's a reserved keyword in some SQL dialects
    order = db.session.query(Order).join(OrderItem).join(Product)\
        .filter(Order.id == order_id)\
        .filter(Product.tenant_id == tenant.id)\
        .first_or_404()

    order.status = new_status
    db.session.commit()

    return jsonify({"message": f"Order status updated to {new_status}", "status": new_status}), 200
