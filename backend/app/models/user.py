from sqlalchemy import Column, Integer, String
from app.database import Base
from datetime import datetime, timezone

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    password = Column(String, nullable=True)
    
    recettes = relationship("Recette", back_populates="user")
    comments = relationship("Comment", back_populates="user")

class Recette(Base):
    __tablename__ = "recettes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titre = Column(String, nullable=True)
    description = Column(String, nullable=True)
    instructions = Column(String, nullable=True)
    created_at = Column(datetime, default=datetime.now(timezone.utc))