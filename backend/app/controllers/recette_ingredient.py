from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.crud import recette_ingredient as crud
from app.schemas import Recette_ingredientCreate


def create_recette_ingredient(db: Session, recette_ingredient: Recette_ingredientCreate, user_id):
    return crud.create_recette_ingredient(db, recette_ingredient, user_id)


def delete_recette_ingredient(db: Session, recette_id: int, ingredient_id: int):
    return crud.delete_recette_ingredient(db, recette_id, ingredient_id)