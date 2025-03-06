from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str
    last_name: Optional[str] = None
    first_name: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int

    class Config:
        orm_mode = True  

#RECETTE
class RecetteBase(BaseModel):
    titre: str
    description: Optional[str] = None
    instructions: Optional[str] = None

class RecetteCreate(RecetteBase):
    pass

class Recette(RecetteBase):
    id: int

    class Config:
        orm_mode = True 