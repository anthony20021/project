from sqlalchemy.orm import Session
from app.models.ingredient import Ingredient
from fastapi import HTTPException

def get_ingredient(db: Session):
    ingredients = db.query(Ingredient).all()
    if not ingredients:
        raise HTTPException(status_code=404, detail="No ingredients found")
    return ingredients