from flask import Blueprint, request, jsonify
from app import db, jwt
from app.models import User, UserRole
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', UserRole.CUSTOMER.value)
    
    # Security: Prevent unauthorized admin creation
    if role == UserRole.ADMIN.value:
        return jsonify({"message": "Unauthorized role registration"}), 403

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"message": "User already exists"}), 400

    new_user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        role=role
    )
    db.session.add(new_user)
    db.session.commit()

    # If tenant, create tenant profile
    if role == UserRole.TENANT.value:
        from app.models import Tenant
        new_tenant = Tenant(
            user_id=new_user.id,
            shop_name=data.get('shop_name', f"{username}'s Shop"),
            category=data.get('category', 'General'),
            is_approved=False
        )
        db.session.add(new_tenant)
        db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        # Identity must be a string, additional data goes in additional_claims
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={'role': user.role, 'username': user.username}
        )
        return jsonify(access_token=access_token, role=user.role, username=user.username), 200

    return jsonify({"message": "Invalid credentials"}), 401
