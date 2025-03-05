from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Ingredient(Base):
    __tablename__ = 'Ingredients'
    
    ingredient_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    
    recette = relationship("Recette_ingredients", back_populates="Ingredient")
