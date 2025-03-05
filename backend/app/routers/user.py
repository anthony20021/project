from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.controllers.user import create_new_user, get_user_by_id  
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users/")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return create_new_user(db, user)  

@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_by_id(db, user_id)
