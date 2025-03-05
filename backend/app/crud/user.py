import bcrypt
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas import UserCreate
from sqlalchemy.exc import IntegrityError

def get_user(db: Session, user_id: int):
    try:
        return db.query(User).filter(User.id == user_id).first()
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        
def create_user(db: Session, user: UserCreate):
    try:
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
        db_user = User(last_name=user.last_name, password=hashed_password, email=user.email, first_name=user.first_name)
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