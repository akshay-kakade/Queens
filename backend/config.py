import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-super-secret-key'
    # Access tokens will now be valid for 5 hours
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=5)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///site.db'

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    # In production, ensure DATABASE_URL is set to the Neon DB URL
