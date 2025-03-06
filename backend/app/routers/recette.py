from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.database import get_db
from app.controllers.recette import create_recette, get_recette_by_id
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("recette/{recette_id}")
def get_recette(recette_id: int, db: Session = Depends(get_db)):
    return get_recette_by_id(db, recette_id)

@router.post("/recettes/")
def create_recette(recette: schemas.RecetteCreate, db: Session = Depends(get_db)):
    return create_recette(db, recette)