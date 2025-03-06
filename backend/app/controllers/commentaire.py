from fastapi import HTTPException, Request, status
from sqlalchemy.orm import Session
from app.crud import commentaire as crud
from app.schemas import CommentaireCreate
from app.models.commentaires import Commentaire

def get_commentaire_all(db: Session, recette_id: int):
    db_commentaire = crud.get_commentaire(db, recette_id)
    if db_commentaire is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_commentaire

def create_new_commentaire(db: Session, commentaire: CommentaireCreate):
    return crud.create_commentaire(db, commentaire)

def modify_comment(db: Session, commentaire_id: int, commentaire: CommentaireCreate):
    return crud.modify_commentaire(db, commentaire_id, commentaire)

def delete_comment(db: Session, commentaire_id: int):
    return crud.delete_commentaire(db, commentaire_id)