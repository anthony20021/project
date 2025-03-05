from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Favorie(Base):
    __tablename__ = 'Favories'
    
    user_id = Column(Integer, ForeignKey('Users.id'), primary_key=True)
    recette_id = Column(Integer, ForeignKey('Recettes.id'), primary_key=True)
    user = relationship("User", back_populates="favories")
    recette = relationship("Recette", back_populates="favories")
    
from app.models.user import User
from app.models.recette import Recette