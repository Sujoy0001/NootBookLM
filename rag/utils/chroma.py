import chromadb
from chromadb.config import Settings

import os
from dotenv import load_dotenv

load_dotenv()

CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")

client = chromadb.HttpClient(
    host="https://api.chroma.com",
    ssl=True,
    headers={
        "Authorization": f"Bearer {CHROMA_API_KEY}",
        "X-Chroma-Tenant": CHROMA_TENANT,
        "X-Chroma-Database": CHROMA_DATABASE
    }
)

collection = client.get_or_create_collection(
    name="rag_documents",
    metadata={"hnsw:space": "cosine"}
)

collection.add(
    ids=["chunk_1"],
    embeddings=[embedding_vector],  # list of floats
    documents=["This is the chunk text"],
    metadatas=[{
        "user_id": "user_42",
        "file_name": "rag.pdf",
        "chunk_index": 1
    }]
)