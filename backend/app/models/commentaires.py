from sqlalchemy import Column, Integer, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Comment(Base):
    __tablename__ = 'Commentaires'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    created_at = Column(Date, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    recipe_id = Column(Integer, ForeignKey('recipes.id'), nullable=False)
    
    user = relationship("User", back_populates="Commentaires")
    recipe = relationship("Recette", back_populates="Commentaires")
