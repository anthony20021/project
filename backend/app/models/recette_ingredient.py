from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Recette_ingredient(Base):
    __tablename__ = 'Recettes_ingredients'
    
    recette_id = Column(Integer, ForeignKey('Recettes.id'), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey('Ingredients.id'), primary_key=True)
    quantity = Column(Integer, nullable=False)
    
    recette = relationship("Recette", back_populates="recettes_ingredients")
    ingredient = relationship("Ingredient", back_populates="recette")

from app.models.recette import Recette
from app.models.ingredient import Ingredient