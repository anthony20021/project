from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.controllers.commentaire import create_new_commentaire, get_commentaire_all
from app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/commentaires/")
def create_commentaire(commentaire: schemas.CommentaireCreate, db: Session = Depends(get_db)):
    return create_new_commentaire(db, commentaire)  

@router.get("/commentaires/{recette_id}")
def get_commentaire(recette_id: int, db: Session = Depends(get_db)):
    return get_commentaire_all(db, recette_id)