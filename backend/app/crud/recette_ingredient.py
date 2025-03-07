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


def delete_recette_ingredient(db: Session, recette_id: int, ingredient_id: int):
    try:
        deleted_rows = db.query(Recette_ingredient).filter(
            and_(
                Recette_ingredient.recette_id == recette_id,
                Recette_ingredient.ingredient_id == ingredient_id  # Vérifie si c'est bien le bon champ
            )
        ).delete()

        db.commit()

        if deleted_rows == 0:
            raise HTTPException(
                status_code=404,
                detail="Aucun ingrédient trouvé pour cette recette"
            )

        return {"message": "Recette_ingredient supprimé avec succès."}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Une erreur s'est produite : {str(e)}"
        )
