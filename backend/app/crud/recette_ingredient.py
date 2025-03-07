from sqlalchemy.orm import Session
from app.models.recette_ingredient import Recette_ingredient
from app.models.recette import Recette
from fastapi import HTTPException, status
from sqlalchemy import and_


def create_recette_ingredient(db: Session, recette_ingredient_create, user_id: int):
    # Vérifier si la recette existe et si le user_id correspond à celui de la recette
    recette = db.query(Recette).filter(Recette.id == recette_ingredient_create.recette_id).first()

    if not recette:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recette non trouvée"
        )

    if recette.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'êtes pas autorisé à ajouter des ingrédients à cette recette"
        )
    
    # Si la recette appartient bien à l'utilisateur, on crée le recette_ingredient
    recette_ingredient = Recette_ingredient(
        recette_id=recette_ingredient_create.recette_id,
        ingredient_id=recette_ingredient_create.ingredient_id,
        quantity=recette_ingredient_create.quantity
    )
    
    db.add(recette_ingredient)
    db.commit()
    db.refresh(recette_ingredient)
    
    return recette_ingredient


def delete_recette_ingredient(db: Session, recette_ingredient_delete, user_id: int):
    try:
        # Vérifier que la recette appartient bien à l'utilisateur avant de supprimer
        recette_ingredient = (
            db.query(Recette_ingredient)
            .join(Recette, Recette_ingredient.recette_id == Recette.id)  # Jointure avec Recette
            .filter(
                and_(
                    Recette_ingredient.recette_id == recette_ingredient_delete.recette_id,
                    Recette_ingredient.ingredient_id == recette_ingredient_delete.ingredient_id,
                    Recette.user_id == user_id  # Vérifie que l'utilisateur est le propriétaire de la recette
                )
            )
            .first()
        )

        if not recette_ingredient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recette ou ingrédient introuvable, ou vous n'êtes pas autorisé à supprimer cet ingrédient"
            )

        # Suppression de l'ingrédient
        db.delete(recette_ingredient)
        db.commit()

        return {"message": "Recette_ingredient supprimé avec succès."}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Une erreur s'est produite : {str(e)}"
        )
