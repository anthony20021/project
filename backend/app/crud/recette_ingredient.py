from sqlalchemy.orm import Session
from app.models.recette_ingredient import Recette_ingredient


def create_recette_ingredient(db: Session, recette_ingredient: Recette_ingredient):
    db.add(recette_ingredient)
    db.commit()
    db.refresh(recette_ingredient)
    return recette_ingredient

def delete_recette_ingredient(db: Session, recette_ingredient: Recette_ingredient):
    db.delete(recette_ingredient)
    db.commit()
    return recette_ingredient