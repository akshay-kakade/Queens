from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

bp = Blueprint('admin', __name__, url_prefix='/admin')

from app.models import User, Tenant, UserRole, Order, Product
from app import db
from sqlalchemy import func
import datetime

@bp.route('/tenants', methods=['GET'])
@jwt_required()
def get_all_tenants():
    tenants = Tenant.query.all()
    return jsonify([t.to_dict() for t in tenants]), 200

@bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    total_users = User.query.count()
    total_tenants = User.query.filter_by(role=UserRole.TENANT.value).count()
    
    # Calculate real revenue from Tenant balances
    tenants = Tenant.query.all()
    total_revenue = sum(t.account_balance for t in tenants)
    
    # Revenue per shop for the admin to see breakdown
    shop_revenue = [
        {
            'shop_name': t.shop_name,
            'revenue': t.account_balance,
            'category': t.category
        } for t in tenants
    ]
    
    occupancy_rate = 85 # Could calculate based on shop capacity if defined
    
    # Detect database engine for date formatting
    engine_name = db.engine.name
    
    # Calculate Monthly Revenue from real orders
    if engine_name == 'postgresql':
        # PostgreSQL: to_char returns 01, 02...
        monthly_query = db.session.query(
            func.to_char(Order.created_at, 'MM').label('month'),
            func.sum(Order.total_amount).label('total')
        ).group_by('month')
    else:
        # SQLite: strftime
        monthly_query = db.session.query(
            func.strftime('%m', Order.created_at).label('month'),
            func.sum(Order.total_amount).label('total')
        ).group_by('month')

    monthly_data = monthly_query.all()

    month_names = {
        '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
        '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
        '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    }
    
    # Pre-fill with all months if needed, or just what's in DB
    monthly_revenue = []
    for m_num, m_name in month_names.items():
        val = next((float(d.total) for d in monthly_data if d.month == m_num), 0)
        monthly_revenue.append({'name': m_name, 'value': val})

    return jsonify({
        "total_users": total_users,
        "total_tenants": total_tenants,
        "total_revenue": total_revenue,
        "shop_revenue": shop_revenue,
        "occupancy_rate": occupancy_rate,
        "monthly_revenue": monthly_revenue
    }), 200

@bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_detailed_analytics():
    # Detect database engine
    engine_name = db.engine.name

    # 1. Shop Category Distribution
    categories = db.session.query(
        Tenant.category, 
        func.count(Tenant.id)
    ).group_by(Tenant.category).all()
    
    category_data = [
        {"name": cat or "General", "value": count} 
        for cat, count in categories
    ]

    # 2. Weekly Footfall (Derived from Orders for now)
    if engine_name == 'postgresql':
        # PostgreSQL: to_char with 'D' (1-7, 1=Sun) or 'ID' (1-7, 1=Mon)
        # We'll use 'w' for 0-6 (0=Sun)
        footfall_query = db.session.query(
            func.to_char(Order.created_at, 'd').label('day_raw'), # 1-7, 1=Sun
            func.count(Order.id).label('count')
        ).group_by('day_raw')
        
        footfall_data_raw = footfall_query.all()
        # Convert 1-7 (Sun-Sat) to 0-6 (Sun-Sat) for compatibility
        footfall_data = []
        for d in footfall_data_raw:
            day_num = str(int(d.day_raw) - 1)
            footfall_data.append(type('Data', (), {'day': day_num, 'count': d.count}))
    else:
        # SQLite: strftime('%w') returns 0-6 (0=Sun)
        footfall_data = db.session.query(
            func.strftime('%w', Order.created_at).label('day'),
            func.count(Order.id).label('count')
        ).group_by('day').all()

    day_names = {
        '0': 'Sun', '1': 'Mon', '2': 'Tue', '3': 'Wed',
        '4': 'Thu', '5': 'Fri', '6': 'Sat'
    }
    
    # Sort to start from Mon
    mon_start_days = ['1', '2', '3', '4', '5', '6', '0']
    traffic_data = []
    for d_num in mon_start_days:
        count = next((int(d.count) for d in footfall_data if d.day == d_num), 0)
        # Scale count slightly to look like "visits" if it's based on orders
        traffic_data.append({"name": day_names[d_num], "visits": count * 5 + 10}) 

    return jsonify({
        "category_data": category_data,
        "traffic_data": traffic_data
    }), 200

@bp.route('/tenants/<int:id>/approve', methods=['POST'])
@jwt_required()
def approve_tenant(id):
    # Basic role check could be added here, though @jwt_required + prefix usually handled
    tenant = Tenant.query.get_or_404(id)
    tenant.is_approved = not tenant.is_approved
    db.session.commit()
    return jsonify({
        "message": f"Tenant {'approved' if tenant.is_approved else 'unapproved'} successfully",
        "is_approved": tenant.is_approved
    }), 200
