from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.controllers.favorie import create_favorie, delete_favorie, get_recette, get_favorie
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
    db: Session = Depends(get_db),
    user_id: int = Depends(check_token)  
    ):
    return create_favorie(db, favorie, user_id)



@router.delete("/favorie/")
def delete_favorie_endpoint(
    favorie: schemas.FavorieCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(check_token)  
     ):
    return delete_favorie(db, favorie, user_id)  

@router.get("/favorie/")
def get_favorie_endpoint(
    db: Session = Depends(get_db),
    user_id: int = Depends(check_token)
    ):
    return get_favorie(db, user_id)   

@router.get("/favorie/recettes/")
def get_favorie_recettes_endpoint(
    db: Session = Depends(get_db),
    user_id: int = Depends(check_token)
    ):
    return get_recette(db, user_id) 