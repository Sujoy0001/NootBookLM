from model.user import User
from model.user import RegisterUser
from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(user: RegisterUser):
    # Here you would normally add logic to save the user to a database
    # For this example, we'll just return a dummy user with an ID of 1
    if user.email == "":
        raise HTTPException(status_code=400, detail="Email is required")
    return User(id=1, name=user.name, email=user.email)

@router.post("/login")
async def login_user(email: str, password: str):
    # Here you would normally add logic to authenticate the user
    # For this example, we'll just check if the email and password are not empty
    if email == "" or password == "":
        raise HTTPException(status_code=400, detail="Email and password are required")
    return {"message": "Login successful"}