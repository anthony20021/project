from sqlalchemy import Column, Integer, String
from app.database import Base
from datetime import datetime, timezone
 

class Recette(Base):
    __tablename__ = "recettes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titre = Column(String, nullable=True)
    description = Column(String, nullable=True)
    instructions = Column(String, nullable=True)
    created_at = Column(datetime, default=datetime.now(timezone.utc))