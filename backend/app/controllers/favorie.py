from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.crud import favorie as crud
from app.schemas import FavorieCreate
from app.models.favorie import Favorie


def create_favorie(db: Session,  favorie: FavorieCreate):
    return crud.create_favorie(db, favorie)


def delete_favorie(db: Session, favorie: FavorieCreate):
    return crud.delete_favorie(db, favorie)

