from sqlite3 import IntegrityError
from app.models.favorie import Favorie
from sqlalchemy.orm import Session
from app.schemas import FavorieCreate


def create_favorie(db: Session,  favorie: FavorieCreate):
    favorie = Favorie(user_id=favorie.user_id, recette_id=favorie.recette_id)
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


def delete_favorie(db: Session, favorie: FavorieCreate):
    try:
        db.query(Favorie).filter(Favorie.user_id == favorie.user_id, Favorie.recette_id == favorie.recette_id).delete()
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

