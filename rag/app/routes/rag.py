from fastapi import APIRouter, HTTPException
from ..service.ingestion import load_user_documents, split_documents
from ..utils.chroma import create_vector_store
from ..database.mongodb import docs_collection

router = APIRouter()

async def fetch_document_from_mongo(user_id: str, filename: str):

    user_data = await docs_collection.find_one({"user_id": user_id})

    if not user_data or "documents" not in user_data:
        raise Exception("No documents found for this user")
    

    for doc in user_data["documents"]:
        if doc.get("filename") == filename:
            return doc
        
    raise Exception("Document not found for this user")


@router.post("/rag/ingest")
async def ingest_user_documents(user_id: str):

    try:
        documents = await load_user_documents(user_id)

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