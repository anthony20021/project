from sqlalchemy.orm import Session
from app.models.recette_ingredient import Recette_ingredient


def create_recette_ingredient(db, recette_ingredient_create: Recette_ingredient):
    recette_ingredient = Recette_ingredient(
        recette_id=recette_ingredient_create.recette_id,
        ingredient_id=recette_ingredient_create.ingredient_id,
        quantity=recette_ingredient_create.quantity
    )
    
    db.add(recette_ingredient)
    db.commit()
    db.refresh(recette_ingredient)
    
    return recette_ingredient