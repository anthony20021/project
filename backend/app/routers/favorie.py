from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.controllers.favorie import create_favorie, delete_favorie
from app.database import SessionLocal
from app.Middleware.middleware import check_token


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/favorie/")
def create_favorie_endpoint(
    favorie: schemas.FavorieCreate,
    db: Session = Depends(get_db)
    ):
    return create_favorie(db, favorie)



@router.delete("/favorie/")
def delete_favorie_endpoint(
    favorie: schemas.FavorieCreate,
    db: Session = Depends(get_db)
     ):
    return delete_favorie(db, favorie)  
