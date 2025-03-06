from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, timezone

class Recette(Base):
    __tablename__ = "Recettes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titre = Column(String, nullable=True)
    description = Column(String, nullable=True)
    instructions = Column(String, nullable=True)
    created_at = Column(datetime, default=datetime.now(timezone.utc))
    temps_preparation = Column(Integer, nullable=True)
    user_id = Column(Integer, ForeignKey('Users.id'), nullable=False)

    user = relationship("User", back_populates="Recette")
    commentaires = relationship("Commentaire", back_populates="Recette")
    favories = relationship("Favorie", back_populates="Recette")
    recettes_ingrédients = relationship("Recette_ingredient", back_populates="Recette")


