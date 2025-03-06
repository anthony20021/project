from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import timezone, datetime
 
class Recette(Base):
    __tablename__ = "Recettes"
 
    id = Column(Integer, primary_key=True, autoincrement=True)
    temps_preparation = Column(Integer)
    titre = Column(String, nullable=True)
    description = Column(String, nullable=True)
    instructions = Column(String, nullable=True)
    type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    user_id = Column(Integer, ForeignKey('Users.id'), nullable=False)
 
    user = relationship("User", back_populates="recettes")
    commentaires = relationship("Commentaire", back_populates="recipe")
    favories = relationship("Favorie", back_populates="recette")
    recettes_ingredients = relationship("Recette_ingredient", back_populates="recette")
 
from app.models.user import User
from app.models.commentaires import Commentaire
from app.models.favorie import Favorie
from app.models.recette_ingredient import Recette_ingredient