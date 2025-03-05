from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    password = Column(String, nullable=True)
    
    #recettes = relationship("Recette", back_populates="user")
    #comments = relationship("Comment", back_populates="user")
