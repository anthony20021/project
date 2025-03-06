import bcrypt
import jwt
import re
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas import UserCreate
from sqlalchemy.exc import IntegrityError
import os


def get_user(db: Session, user_id: int):
    try:
        return db.query(User).filter(User.id == user_id).first()
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        
def create_user(db: Session, user: UserCreate):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not user.password or not user.first_name or not user.last_name or not user.email:
        print("Password, first name, last name and email cannot be null.")
        return "Password, first name, last name and email cannot be null."

    if not re.match(email_regex, user.email):
        print("Invalid email format.")
        return "Invalid email format."
    
    db_user = None

    try:
        # Check if the email already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            print("Email already in use.")
            return "Email already in use."
        
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        db_user = User(last_name=user.last_name, password=hashed_password.decode('utf-8'), email=user.email, first_name=user.first_name)
        db.add(db_user)
        db.commit()  
    except IntegrityError as e:
        db.rollback() 
        print(f"Erreur d'intégrité : {e.orig}")
    except Exception as e:
        db.rollback()  # Annuler en cas d'autres erreurs
        print(f"Une erreur s'est produite : {e}")
        db_user = None 
    else:
        print("Utilisateur créé avec succès.")
    finally:
        if db_user:
            db.refresh(db_user)  
    return "Utilisateur créé avec succès."

def login(db: Session, email: str, password: str):
    SECRET_KEY = os.getenv("SECRET_KEY", "secret_key")
    try:
        user = db.query(User).filter(User.email == email).first()
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            token = jwt.encode({
                'user_id': user.id,
                'user_email': user.email,
                'user_first_name': user.first_name,
                'user_last_name': user.last_name,
                'exp': datetime.utcnow() + timedelta(hours=24)  # Le jeton expire après 24 heures
            }, SECRET_KEY, algorithm='HS256')
            return {'token': token, 'user_id': user.id}
        else:             
            raise HTTPException(                 
                status_code=status.HTTP_401_UNAUTHORIZED,                 
                detail='Invalid credentials' 
            )
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(                 
            status_code=status.HTTP_500_UNAUTHORIZED,                 
            detail="Une erreur c'est produite" 
        )