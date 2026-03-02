from fastapi import APIRouter, HTTPException
from service.ingestion import load_user_documents, split_documents
from utils.chroma import create_vector_store
import requests

router = APIRouter()

@router.post("/rag/ingest")
async def ingest_user_documents(user_id: str):

    try:
        # 1️⃣ Load from Mongo
        documents = await load_user_documents(user_id)

        # 2️⃣ Chunk
        chunks = split_documents(documents)

        # 3️⃣ Embed + Upload
        create_vector_store(user_id, chunks)

        return {
            "message": "User documents embedded successfully",
            "total_documents": len(documents),
            "total_chunks": len(chunks)
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))