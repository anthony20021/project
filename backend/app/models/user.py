from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    password = Column(String, nullable=True)
    
    recettes = relationship("Recette", back_populates="user")
    commentaires = relationship("Commentaire", back_populates="user")
    favories = relationship("Favorie", back_populates="user")

from app.models.recette import Recette 
from app.models.commentaires import Commentaire
from app.models.favorie import Favorie