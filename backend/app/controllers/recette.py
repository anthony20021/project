from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.crud import recette as crud
from app.schemas import RecetteCreate
from app.models.recette import Recette

def get_recette_by_id(db: Session, recette_id: int):
    db_recette = crud.read_recette(db, recette_id)
    if db_recette is None:
        raise HTTPException(status_code=404, detail="Recette not found")
    return db_recette


def create_recette(db: Session, recette: RecetteCreate, user_id: int):
    return crud.create_recette(db, recette, user_id)


def list_recettes(db: Session):
    return crud.list_recettes(db)


def delete_recette(db: Session, recette_id: int, user_id: int):
    return crud.delete_recette(db, recette_id, user_id)


def update_recette(db: Session, recette_id: int, recette: RecetteCreate, user_id: int):
    return crud.update_recette(db, recette_id, recette, user_id)
