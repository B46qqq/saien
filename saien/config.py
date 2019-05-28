import os

class Config:
    SECRET_KEY = 'SOmekeyfromOS>ENVIRON.GET'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
