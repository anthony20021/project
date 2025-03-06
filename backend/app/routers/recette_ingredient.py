from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.controllers.recette_ingredient import create_recette_ingredient
from app.database import SessionLocal
from app.Middleware.middleware import check_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/recettes/{recette_id}/ingredients/")
def create_recette_ingredient_endpoint(recette_ingredient: schemas.Recette_ingredientCreate, db: Session = Depends(get_db), token: str = Depends(check_token)):
    return create_recette_ingredient(db, recette_ingredient)