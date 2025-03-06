from app.crud import ingredient as crud
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas import IngredientBase  # S'il est nécessaire dans d'autres cas

def list_ingredient(db: Session):
    return crud.get_ingredient(db)
