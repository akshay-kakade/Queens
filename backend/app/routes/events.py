from flask import Blueprint, jsonify, request
from app.models import Event, Tenant, User, UserRole
from app import db
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('events', __name__, url_prefix='/events')

@bp.route('/', methods=['GET'])
def get_events():
    # Fetch all upcoming events (including today)
    from sqlalchemy import func
    now = datetime.utcnow()
    # Use func.date to compare just the date part (ignoring time)
    # This ensures an event at 10 AM today is still visible at 2 PM today
    events = Event.query.filter(func.date(Event.date) >= func.date(now)).order_by(Event.date.asc()).all()
    return jsonify([event.to_dict() for event in events]), 200

@bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()
    # Handle both string and dict identity for backward compatibility/robustness
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id

    user = User.query.get(int(user_id))
    
    # Allow Admins and Tenants to create events
    if user.role not in [UserRole.ADMIN, UserRole.TENANT]:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    
    try:
        # If tenant, associate event with them
        tenant_id = None
        if user.role == UserRole.TENANT and user.tenant_profile:
            tenant_id = user.tenant_profile.id
            
        new_event = Event(
            name=data['name'],
            description=data.get('description', ''),
            date=datetime.fromisoformat(data['date'].replace('Z', '+00:00')),
            image_url=data.get('image_url', ''),
            tenant_id=tenant_id
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.to_dict()), 201
    except Exception as e:
        print(f"Error creating event: {e}")
        return jsonify({"message": "Failed to create event"}), 500

@bp.route('/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def manage_event(id):
    current_user_id = get_jwt_identity()
    if isinstance(current_user_id, dict):
        user_id = current_user_id.get('id')
    else:
        user_id = current_user_id

    user = User.query.get(int(user_id))
    
    # Allow Admins and Tenants
    if user.role not in [UserRole.ADMIN, UserRole.TENANT]:
        return jsonify({"message": "Unauthorized"}), 403

    event = Event.query.get_or_404(id)

    # If tenant, ensure they own the event
    if user.role == UserRole.TENANT:
        if not event.tenant_id or event.tenant_id != user.tenant_profile.id:
             return jsonify({"message": "Unauthorized"}), 403

    if request.method == 'DELETE':
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Event deleted"}), 200

    if request.method == 'PUT':
        data = request.get_json()
        event.name = data.get('name', event.name)
        event.description = data.get('description', event.description)
        if 'date' in data:
            event.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        event.image_url = data.get('image_url', event.image_url)
        
        db.session.commit()
        return jsonify(event.to_dict()), 200

# Endpoint to seed some dummy events if none exist (for demo)
@bp.route('/seed', methods=['POST'])
def seed_events():
    if Event.query.count() == 0:
        events = [
            Event(name="Summer Music Fest", description="Live music at the central atrium!", date=datetime(2026, 6, 15), image_url="https://source.unsplash.com/random?concert"),
            Event(name="Mega Sale", description="Up to 50% off in all electronic stores.", date=datetime(2026, 7, 1), image_url="https://source.unsplash.com/random?sale"),
            Event(name="Kids Carnival", description="Fun games and prizes for kids.", date=datetime(2026, 5, 20), image_url="https://source.unsplash.com/random?carnival"),
        ]
        db.session.add_all(events)
        db.session.commit()
        return jsonify({"message": "Seeded events"}), 201
    return jsonify({"message": "Events already exist"}), 200
