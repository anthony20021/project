from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.controllers.commentaire import create_new_commentaire, get_commentaire_all, modify_comment, delete_comment
from app.database import SessionLocal
from app.Middleware.middleware import check_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/commentaires/")
def create_commentaire(commentaire: schemas.CommentaireCreate, db: Session = Depends(get_db), user_id: int = Depends(check_token)):
    return create_new_commentaire(db, commentaire, user_id)  

@router.get("/commentaires/{recette_id}")
def get_commentaire(recette_id: int, db: Session = Depends(get_db)):
    return get_commentaire_all(db, recette_id)

@router.put("/commentaire_modifie/{commentaire_id}")
def modify_commentaire(commentaire_id: int, commentaire: schemas.CommentaireCreate, db: Session = Depends(get_db), user_id: int = Depends(check_token)):
    return modify_comment(db, commentaire_id, commentaire, user_id)

@router.delete("/commentaires_delete/{commentaire_id}")
def delete_commentaire(commentaire_id: int, db: Session = Depends(get_db), user_id: int = Depends(check_token)):
    return delete_comment(db, commentaire_id, user_id)