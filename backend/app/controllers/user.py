from fastapi import HTTPException, Request, status
from sqlalchemy.orm import Session
from app.crud import user as crud
from app.schemas import UserCreate
from app.models.user import User

def get_user_by_id(db: Session, user_id: int):
    db_user = crud.get_user(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

def create_new_user(db: Session, user: UserCreate):
    return crud.create_user(db, user)

def login_user(db: Session, user_email: str, user_password: str):
    return crud.login(db, user_email, user_password)