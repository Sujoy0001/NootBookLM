from fastapi import FastAPI
from routes import upload

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


app.include_router(upload.router)