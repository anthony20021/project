from app.models.recette import Recette
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas import RecetteCreate



def read_recette(db: Session, recette_id: int):
    try:
        return db.query(Recette).filter(Recette.id == recette_id).first()
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")


def create_recette(db: Session, recette: RecetteCreate):
    try:
        db_recette = Recette(titre=recette.titre, description=recette.description, instructions=recette.instructions)
        db.add(db_recette)
        db.commit()
    except IntegrityError as e:
        db.rollback()  
        print(f"Erreur d'intégrité : {e.orig}")
    except Exception as e:
        db.rollback()
        print(f"Une erreur s'est produite : {e}")
    else:
        print("Recette crée avec succès.")
    finally:
        db.refresh(db_recette)
    return db_recette