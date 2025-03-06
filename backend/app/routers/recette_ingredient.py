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

@router.post("/recettes/ingredients/", response_model=schemas.Recette_ingredient)
def create_recette_ingredient_endpoint(
    recette_ingredient: schemas.Recette_ingredientCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(check_token)  
):
    # Convertir le modèle Pydantic en un modèle SQLAlchemy
    return create_recette_ingredient(db, recette_ingredient, user_id)