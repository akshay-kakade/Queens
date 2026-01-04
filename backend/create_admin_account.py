import sys
import os

# Add the current directory to path so we can import 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User, UserRole
from werkzeug.security import generate_password_hash

def create_admin(username, email, password):
    app = create_app()
    with app.app_context():
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            print(f"Error: User '{username}' already exists.")
            return

        # Create the admin user
        admin = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password),
            role=UserRole.ADMIN.value
        )
        
        try:
            db.session.add(admin)
            db.session.commit()
            print(f"Success! Admin account '{username}' created.")
        except Exception as e:
            db.session.rollback()
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    print("--- Queens Club Admin Creator ---")
    u = input("Enter Admin Username: ")
    e = input("Enter Admin Email: ")
    p = input("Enter Admin Password: ")
    
    create_admin(u, e, p)
