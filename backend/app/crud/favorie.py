from sqlite3 import IntegrityError
from app.models.favorie import Favorie
from sqlalchemy.orm import Session,joinedload
from app.schemas import FavorieCreate


def create_favorie(db: Session,  favorie: FavorieCreate, user_id):
    favorie = Favorie(user_id=user_id, recette_id=favorie.recette_id)
    try:
        db.add(favorie)
        db.commit()
        print("Favorie crée avec succès.")
    except IntegrityError as e:
        db.rollback()
        print(f"Erreur d'intégrité : {e.orig}")
    except Exception as e:
        db.rollback()
        print(f"Une erreur s'est produite : {e}")
    finally:
        if favorie:
            db.refresh(favorie)
    return favorie


def delete_favorie(db: Session, favorie: FavorieCreate, user_id):
    try:
        db.query(Favorie).filter(Favorie.user_id == user_id, Favorie.recette_id == favorie.recette_id).delete()
        db.commit()
        print("Favorie supprimée avec succès.")
        return True
    except IntegrityError as e:
        db.rollback()
        print(f"Erreur d'intégrité : {e.orig}")
    except Exception as e:
        db.rollback()
        print(f"Une erreur s'est produite : {e}")
    return False

def get_favories_by_user(db: Session, user_id):
    try:
        return {
            'data' : db.query(Favorie).filter(Favorie.user_id == user_id).all(),
            'statut' : 'ok',
            "message": "Favoris récupérés avec succès",
        }
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        return {
            'statut' : 'ko',
            "message": "Une erreur s'est produite",
            "data": []
        }
    
def get_recette_by_user(db: Session, user_id):
    try:
        favoris = db.query(Favorie)\
                   .options(joinedload(Favorie.recette))\
                   .filter(Favorie.user_id == user_id)\
                   .all()
        
        recettes = [favori.recette for favori in favoris if favori.recette]

        return {
            'data': recettes,
            'statut': 'ok',
            "message": "Recettes favorites récupérées avec succès",
        }
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        return {
            'statut': 'ko',
            "message": "Une erreur s'est produite",
            "data": []
        }