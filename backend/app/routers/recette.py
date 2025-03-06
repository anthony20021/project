from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.controllers.recette import create_recette, get_recette_by_id, list_recettes
from app.database import SessionLocal
from app.Middleware.middleware import check_token


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/recette/{recette_id}")
def get_recette_endpoint(recette_id: int, db: Session = Depends(get_db)):
    return get_recette_by_id(db, recette_id)



@router.post("/recettes/")
def create_recette_endpoint(
    recette: schemas.RecetteCreate,  
    db: Session = Depends(get_db),
    user_id: int = Depends(check_token)  
):
    return create_recette(db, recette, user_id)


@router.get("/recettes/")
def list_recettes_endpoint(db: Session = Depends(get_db)):
    return list_recettes(db)
