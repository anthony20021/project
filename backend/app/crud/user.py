from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas import UserCreate

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(last_name=user.last_name, email=user.email, first_name=user.first_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user