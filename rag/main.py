from fastapi import FastAPI
from app.routes import upload, rag, ans
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

from app.v2 import upload_route

app = FastAPI(title="Rag server", description="A FastAPI server for Rag integration", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Rag FastAPI Integration!"}

app.include_router(upload.router, prefix="/api/v1", tags=["Document Upload"])

app.include_router(rag.router, prefix="/api/v1", tags=["RAG"])

app.include_router(ans.router, prefix="/api/v1", tags=["Answer Generation"])


# v2 routes

app.include_router(upload_route.router, prefix="/api/v2", tags=["v2"])

