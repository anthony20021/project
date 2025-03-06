from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.crud import recette_ingredient as crud
from app.schemas import Recette_ingredientCreate
from app.models.recette_ingredient import Recette_ingredient


def create_recette_ingredient(db: Session, recette_ingredient: Recette_ingredientCreate):
    return crud.create_recette_ingredient(db, recette_ingredient)