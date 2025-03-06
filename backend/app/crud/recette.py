from app.models.recette import Recette
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.schemas import RecetteCreate



def read_recette(db: Session, recette_id: int):
    try:
        recette = db.query(Recette).filter(Recette.id == recette_id).first()
        if not recette:
            raise HTTPException(status_code=404, detail="Recette not found")
        return recette
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


def create_recette(db: Session, recette: RecetteCreate):
    try:
        db_recette = Recette(titre=recette.titre, description=recette.description, instructions=recette.instructions)
        db.add(db_recette)
        db.commit()
        print("Recette crée avec succès.")
    except IntegrityError as e:
        db.rollback()
        print(f"Erreur d'intégrité : {e.orig}")
        raise HTTPException(status_code=400, detail="Integrity error")
    except Exception as e:
        db.rollback()
        print(f"Une erreur s'est produite : {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.refresh(db_recette)
    return db_recette
