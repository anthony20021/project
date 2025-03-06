import re
from fastapi import HTTPException, status
from datetime import date
from sqlalchemy.orm import Session
from app.models.commentaires import Commentaire
from app.schemas import CommentaireCreate
from sqlalchemy.exc import IntegrityError


def get_commentaire(db: Session, recette_id: int):
    try:
        return db.query(Commentaire).filter(Commentaire.recipes_id == recette_id).all()
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