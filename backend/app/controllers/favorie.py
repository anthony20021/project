from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.crud import favorie as crud
from app.schemas import FavorieCreate
from app.models.favorie import Favorie


def create_favorie(db: Session,  favorie: FavorieCreate, user_id):
    return crud.create_favorie(db, favorie, user_id)


def delete_favorie(db: Session, favorie: FavorieCreate, user_id):
    return crud.delete_favorie(db, favorie, user_id)

def get_favorie(db: Session, user_id):
    return crud.get_favories_by_user(db, user_id=user_id)