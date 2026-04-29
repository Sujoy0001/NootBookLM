from fastapi import FastAPI
from app.routes.v1 import upload
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.utils.limiter import limiter

from app.routes.v2 import upload_route, url_route, ans_route
from app.routes.v1 import ans, delete, rag

app = FastAPI(title="Rag server", description="A FastAPI server for Rag integration", version="2.3.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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

app.include_router(delete.router, prefix="/api/v1", tags=["Data Deletion"])

### v2 routes ###

app.include_router(upload_route.router, prefix="/api/v2", tags=["v2"])
app.include_router(url_route.router, prefix="/api/v2", tags=["v2"]) 
app.include_router(ans_route.router, prefix="/api/v2", tags=["v2"])