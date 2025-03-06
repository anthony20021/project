from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db

router = APIRouter()

@router.get("recette/{recette_id}")
def get_recette(recette_id: int, db: Session = Depends(get_db)):
    recette = crud.get_recette(db, recette_id)
    if not recette:
        raise HTTPException(status_code=404, detail="Recette not found")
    return recette
