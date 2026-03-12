from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str
    email: str

class RegisterUser(BaseModel):
    name: str
    email: str
    password: str