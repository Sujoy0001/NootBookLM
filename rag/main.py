from fastapi import FastAPI, HTTPException, Depends
from utils.chroma import get_chroma_collection
from pydantic import BaseModel
from typing import Optional

class RequestBody(BaseModel):
    ids: list[str]
    documents: list[str]
    metadatas: list[dict]

app = FastAPI(title="ChromaDB FastAPI Integration")

@app.get("/")
async def root():
    return {"message": "Welcome to the ChromaDB FastAPI Integration!"}

@app.post("/api/documents/")
async def add_documents(request: RequestBody, col=Depends(get_chroma_collection)):
    try:
        col.add(
            ids=request.ids,
            documents=request.documents,
            metadatas=request.metadatas
        )
        return {"message": "Documents added successfully", "ids": request.ids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/api/documents")
async def get_documents():
    try:
        documents = get_chroma_collection().get()
        return {"documents": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/documents/{doc_id}")
async def get_document(doc_id: str):
    try:
        document = get_chroma_collection().get(ids=[doc_id])
        if not document['ids']:
            raise HTTPException(status_code=404, detail="Document not found")
        return {"document": document}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))