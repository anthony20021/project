import re
from fastapi import HTTPException, status
from datetime import date
from sqlalchemy.orm import Session
from app.models.commentaires import Commentaire
from app.schemas import CommentaireCreate
from sqlalchemy.exc import IntegrityError


def get_commentaire(db: Session, recette_id: int, user_id: int):
    try:
        return db.query(Commentaire).filter(Commentaire.recipes_id == recette_id and Commentaire.user_id == user_id).all()
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(                 
                status_code=status.HTTP_401_UNAUTHORIZED,                 
                detail='Une erreur sest produite' 
            )
        
def create_commentaire(db: Session, commentaire: CommentaireCreate):

    db_commentaire = None

    try:
        db_commentaire = Commentaire(
            content = commentaire.content, 
            note = commentaire.note, 
            created_at=date.today(), 
            user_id = commentaire.user_id, 
            recipes_id = commentaire.recipes_id
            )
        db.add(db_commentaire)
        db.commit()  
    except IntegrityError as e:
        db.rollback() 
        print(f"Erreur d'intégrité : {e.orig}")
        raise HTTPException(                 
                status_code=status.HTTP_401_UNAUTHORIZED,                 
                detail='Erreur dintégrité' 
            )
    except Exception as e:
        db.rollback()  # Annuler en cas d'autres erreurs
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(                 
                status_code=status.HTTP_401_UNAUTHORIZED,                 
                detail='Une erreur sest produite' 
            )
        db_commentaire = None 
    else:
        print("Commentaire créé avec succès.") 
    return "Commentaire créé avec succès."

def modify_commentaire(db: Session, commentaire_id: int, commentaire: CommentaireCreate):
    try:
        db_commentaire = db.query(Commentaire).filter(Commentaire.id == commentaire_id).first()
        if db_commentaire is None:
            raise HTTPException(status_code=404, detail="Commentaire not found")

        if commentaire.content is not None:
            db_commentaire.content = commentaire.content
        if commentaire.note is not None:
            db_commentaire.note = commentaire.note
        if (db_commentaire.user_id != commentaire.user_id or db_commentaire.recipes_id != commentaire.recipes_id):
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='user_id or recipes_id n\'est pas correct'
        )

        db.commit()
        db.refresh(db_commentaire)
    except IntegrityError as e:
        db.rollback()
        print(f"Erreur d'intégrité : {e.orig}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Erreur d\'intégrité'
        )
    except Exception as e:
        db.rollback()  # Annuler en cas d'autres erreurs
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Une erreur s\'est produite'
        )
    else:
        print("Commentaire modifié avec succès.")
    return db_commentaire

def delete_commentaire(db: Session, commentaire_id: int):
    try:
        db_commentaire = db.query(Commentaire).filter(Commentaire.id == commentaire_id).first()
        if db_commentaire is None:
                raise HTTPException(status_code=404, detail="Commentaire not found")

        db.delete(db_commentaire)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Une erreur s\'est produite'
        )
    else:
        print("Commentaire supprimé avec succès.")
    return {"detail": "Commentaire supprimé avec succès."}