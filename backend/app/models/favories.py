from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Favories(Base):
    __tablename__ = 'Favories'
    
    user_id = Column(Integer, ForeignKey('Recette.id'), primary_key=True)
    recette_id = Column(Integer, ForeignKey('Ingredient.id'), primary_key=True)
    
    user = relationship("User", back_populates="Favories")
    recette = relationship("Recette", back_populates="Favories")