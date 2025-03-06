from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.controllers.ingredient import list_ingredient
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/ingredients/")
def get_ingredients(db: Session = Depends(get_db)):
    return list_ingredient(db)