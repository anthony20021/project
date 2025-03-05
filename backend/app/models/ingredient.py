from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Ingredient(Base):
    __tablename__ = 'Ingredients'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    
    recette = relationship("Recette_ingredient", back_populates="ingredient")

from app.models.recette_ingredient import Recette_ingredient