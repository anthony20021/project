from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.crud import user as crud
from app.schemas import UserCreate
from app.models.recette import Recette


def get_recette_by_id(db: Session, recette_id: int):
    db_recette = crud.read_recette(db, recette_id)
    if db_recette is None:
        raise HTTPException(status_code=404, detail="Recette not found")
    return db_recette
