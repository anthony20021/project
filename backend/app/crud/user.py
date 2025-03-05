import bcrypt
import jwt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas import UserCreate
from sqlalchemy.exc import IntegrityError

SECRET_KEY = "b9c65df28c1984823631f3c2911146c8a610d35f9ef90b9df578fc918eccb8d4"

def get_user(db: Session, user_id: int):
    try:
        return db.query(User).filter(User.id == user_id).first()
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        
def create_user(db: Session, user: UserCreate):
    try:
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
    return db_user

def login(db: Session, email: str, password: str):
    try:
        user = db.query(User).filter(User.email == email).first()
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(hours=24)  # Le jeton expire après 24 heures
            }, SECRET_KEY, algorithm='HS256')
            return {'token': token}
        else:
            return {'error': 'Invalid credentials'}
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        return {'error': 'An error occurred'}