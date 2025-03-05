from sqlalchemy import Column, Integer, String, DateTime
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

    user = relationship("User", back_populates="Recette")
    commentaires = relationship("Commentaire", back_populates="Recette")
    favories = relationship("Favorie", back_populates="Recette")
    recettes_ingrédients = relationship("Recette_ingredient", back_populates="Recette")


