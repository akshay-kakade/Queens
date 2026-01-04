from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
db = SQLAlchemy()
from app.models import User, Tenant, Product, Event, CustomerProfile, UserRole
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # JWT Error Handlers for debugging
    @jwt.invalid_token_loader
    def invalid_token_callback(error_string):
        print(f"Invalid token: {error_string}")
        return jsonify({"message": f"Invalid token: {error_string}"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error_string):
        print(f"Missing token: {error_string}")
        return jsonify({"message": f"Missing authorization header: {error_string}"}), 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print(f"Token expired: {jwt_payload}")
        return jsonify({"message": "Token has expired"}), 401

    # Register blueprints
    from app.routes import auth, admin, tenant, customer, events
    app.register_blueprint(auth.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(tenant.bp)
    app.register_blueprint(customer.bp)
    app.register_blueprint(events.bp)
    
    @app.route('/')
    def index():
        return {"message": "Welcome to The Queens Project API"}

    return app
