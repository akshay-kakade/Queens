# Deployment Guide: Queens Club

This guide provides the steps to deploy the **Queens Club** application to a production environment.

## 1. Prerequisites
- A GitHub account.
- A **Render** or **Railway** account (for Backend).
- A **Vercel** or **Netlify** account (for Frontend).
- A **Neon.tech** account (for managed PostgreSQL database).

---

## 2. Database Setup (Production)
SQLite is not suitable for production. We recommend **Neon PostgreSQL**.

1. Create a new project on [Neon.tech](https://neon.tech/).
2. Copy the **Connection String** (PostgreSQL URI).
3. You will use this as your `DATABASE_URL` environment variable.

---

## 3. Backend Deployment (Flask)
Deploying to **Render** or **Railway**:

1. **GitHub**: Push your `backend` folder to a GitHub repository.
2. **Create Web Service**:
   - Link your GitHub repo.
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app` (Make sure to add `gunicorn` to your `requirements.txt`).
3. **Environment Variables**:
   - `DATABASE_URL`: Your Neon PostgreSQL URI.
   - `SECRET_KEY`: A long random string.
   - `JWT_SECRET_KEY`: Another long random string.
   - `FLASK_ENV`: `production`

---

## 4. Frontend Deployment (React + Vite)
Deploying to **Vercel** or **Netlify**:

1. **GitHub**: Push your `frontend` folder to a GitHub repository.
2. **Create Project**:
   - Link your GitHub repo.
   - **Framework Preset**: Vite.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed Flask Backend (e.g., `https://queens-backend.onrender.com`).

---

## 5. Important Considerations

### CORS Configuration
Ensure your Flask backend allows requests from your frontend production URL. You may need to update `CORS(app)` in `app/__init__.py`:
```python
CORS(app, resources={r"/*": {"origins": ["https://your-frontend-domain.vercel.app"]}})
```

### Database Migrations
In production, you will need to run migrations to create the tables in PostgreSQL:
```bash
flask db upgrade
```
(Usually done as a "Release Command" or "Post-build command" on your hosting platform).

### Initial Admin Creation
Since public registration for Admins is disabled for security, you should create your first admin manually or via a script:
```python
# Run this inside your python env
from app import create_app, db
from app.models import User, UserRole
from werkzeug.security import generate_password_hash

app = create_app()
with app.app_context():
    admin = User(
        username="admin",
        email="admin@queensclub.com",
        password_hash=generate_password_hash("your_secure_password"),
        role=UserRole.ADMIN.value
    )
    db.session.add(admin)
    db.session.commit()
```

### Static Assets
Make sure your `/logo.png` and other images are correctly placed and referenced using absolute paths or relative to the public directory.
