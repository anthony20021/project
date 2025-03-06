from pydantic import BaseModel
from typing import Optional
 
class UserBase(BaseModel):
    email: str
    password: str
    last_name: Optional[str] = None
    first_name: Optional[str] = None
 
class UserCreate(UserBase):
    pass
 
class UserLogin(BaseModel):
    email: str
    password: str
 
class User(UserBase):
    id: int
 
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "my_password",
                "first_name": "John",
                "last_name": "Doe"
            }
        }


class RecetteBase(BaseModel):
    titre: str
    description: str
    instructions: str
    type: str
    temps_preparation: int


class RecetteCreate(RecetteBase):
    pass

class Recette(RecetteBase):
    id: int

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "titre": "Tarte aux pommes",
                "description": "Tarte aux pommes, une recette classique de la cuisine fran aise.",
                "instructions": "Mélanger, mettre dans un moule, cuire, servir chaud.",
                "temps_preparation": 30
            }
        }

class Recette_ingredient(BaseModel):
    recette_id: int
    ingredient_id: int
    quantity: int

class Recette_ingredientCreate(Recette_ingredient):
    pass