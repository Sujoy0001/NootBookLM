from fastapi import FastAPI
from routes import upload, rag

app = FastAPI(title="Rag server", description="A FastAPI server for Rag integration", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Welcome to the Rag FastAPI Integration!"}

app.include_router(upload.router, prefix="/api", tags=["Document Upload"])

app.include_router(rag.router, prefix="/api", tags=["RAG"])