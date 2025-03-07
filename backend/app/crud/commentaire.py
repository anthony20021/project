import re
from fastapi import HTTPException, status
from datetime import date
from sqlalchemy.orm import Session
from app.models.commentaires import Commentaire
from app.schemas import CommentaireCreate
from sqlalchemy.exc import IntegrityError


def get_commentaire(db: Session, recette_id: int):
    try:
        return{
        "data": db.query(Commentaire).filter(Commentaire.recipes_id == recette_id).all(),
        "statut": "ok",
        "message": "Commentaire récupéré avec succès."
        }
    
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(                 
                status_code=status.HTTP_401_UNAUTHORIZED,
                statut="ko",              
                message='Une erreur s\'est produite' 
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
                statut="ko",             
                message='Erreur dintégrité' 
            )
    except Exception as e:
        db.rollback()  # Annuler en cas d'autres erreurs
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(                 
                status_code=status.HTTP_401_UNAUTHORIZED,   
                statut="ko",               
                message='Une erreur sest produite' 
            )
        db_commentaire = None 
    else:
        print("Commentaire créé avec succès.") 
    return {
        "statut": "ok",
        "message": "Commentaire crée avec succès.",
        "data": []
        }

def modify_commentaire(db: Session, commentaire_id: int, commentaire: CommentaireCreate, user_id: int):
    try:
        db_commentaire = db.query(Commentaire).filter(Commentaire.id == commentaire_id and Commentaire.user_id == user_id).first()
        if db_commentaire is None:
            raise HTTPException(status_code=404, message="Commentaire not found")

        if commentaire.content is not None:
            db_commentaire.content = commentaire.content
        if commentaire.note is not None:
            db_commentaire.note = commentaire.note
        if (db_commentaire.user_id != commentaire.user_id or db_commentaire.recipes_id != commentaire.recipes_id):
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            statut="ko", 
            message='user_id or recipes_id n\'est pas correct'
        )

        db.commit()
        db.refresh(db_commentaire)
    except IntegrityError as e:
        db.rollback()
        print(f"Erreur d'intégrité : {e.orig}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            statut="ko", 
            message='Erreur d\'intégrité'
        )
    except Exception as e:
        db.rollback()  # Annuler en cas d'autres erreurs
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            statut="ko", 
            message='Une erreur s\'est produite'
        )
    else:
        print("Commentaire modifié avec succès.")
    return {
        "statut": "ok",
        "message": "Commentaire modifié avec succès.",
        "data": []
        }

def delete_commentaire(db: Session, commentaire_id: int, user_id: int):
    try:
        db_commentaire = db.query(Commentaire).filter(Commentaire.id == commentaire_id and Commentaire.user_id == user_id).first()
        if db_commentaire is None:
                raise HTTPException(status_code=404, message="Commentaire not found")

        db.delete(db_commentaire)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            statut="ko",
            message='Une erreur s\'est produite'
        )
    else:
        print("Commentaire supprimé avec succès.")
    return {
        "statut": "ok",
        "message": "Commentaire supprimé avec succès.",
        "data": []
        }