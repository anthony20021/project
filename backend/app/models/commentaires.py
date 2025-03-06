from sqlalchemy import Column, Integer, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Commentaire(Base):
    __tablename__ = 'Commentaires'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    note = Column(Integer, nullable=False)
    created_at = Column(Date, nullable=False)
    user_id = Column(Integer, ForeignKey('Users.id'), nullable=False)
    recipes_id = Column(Integer, ForeignKey('Recettes.id'), nullable=False)
    
    user = relationship("User", back_populates="commentaires")
    recipe = relationship("Recette", back_populates="commentaires")
    
from app.models.user import User
from app.models.recette import Recette
