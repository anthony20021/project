from app.models.recette import Recette
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from app.schemas import RecetteCreate



def read_recette(db: Session, recette_id: int):
    try:
        return (
            db.query(Recette)
            .filter(Recette.id == recette_id)
            .options(
                joinedload(Recette.recettes_ingredients)  # Charge la relation recette_ingredient
                .joinedload("ingredient")  # Charge les ingrédients liés
            )
            .first()
        )
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        return None

def create_recette(db: Session, recette: RecetteCreate, user_id):
    db_recette = Recette(titre=recette.titre, description=recette.description, instructions=recette.instructions, temps_preparation=recette.temps_preparation, type=recette.type, user_id=user_id)
    try:
        db.add(db_recette)
        db.commit()
        print("Recette crée avec succès.")
    except IntegrityError as e:
        db.rollback()
        print(f"Erreur d'intégrité : {e.orig}")
    except Exception as e:
        db.rollback()
        print(f"Une erreur s'est produite : {e}")
    finally:
        if db_recette:
            db.refresh(db_recette)
    return db_recette

#lister toutes les recettes

def list_recettes(db: Session):
    """Récupère toutes les recettes de la base de données."""
    try:
        return db.query(Recette).all()
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        return []


#lister les recettes par type
def list_recettes_by_type(db: Session, recette_type: str):
    """Récupère toutes les recettes d'un type donné."""
    try:
        return db.query(Recette).filter(Recette.type == recette_type).all()
    except Exception as e:
        print(f"Une erreur s'est produite : {e}")
        return []




#lister les recettes par ingredient

#lister les recettes par utilisateur
