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
