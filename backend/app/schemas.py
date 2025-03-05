from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    email: str
    password: str
    last_name: Optional[str] = None
    first_name: Optional[str] = None

class UserCreate(UserBase):
    pass

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
