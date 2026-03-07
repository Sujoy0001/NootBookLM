from annotated_types import doc
import chromadb
import os
from langchain_core.embeddings import Embeddings
from dotenv import load_dotenv
from .jina import JinaEmbeddings

load_dotenv()

def create_vector_store(user_id: str, chunks):

    client = chromadb.CloudClient(
        api_key=os.getenv("CHROMA_API_KEY"),
        tenant=os.getenv("CHROMA_TENANT"),
        database=os.getenv("CHROMA_DATABASE")
    )

    collection = client.get_or_create_collection(
        name=f"rag_{user_id}",  
        metadata={"hnsw:space": "cosine"}
    )

    jina_api_key = os.getenv("JINA_API_KEY")

    embeddings = JinaEmbeddings(
        api_key=jina_api_key,
        model="jina-embeddings-v4"
    )

    texts = [chunk.page_content for chunk in chunks]
    metadatas = [chunk.metadata for chunk in chunks]

    ids = [f"{user_id}_chunk_{i}" for i in range(len(chunks))]

    vectors = embeddings.embed_documents(texts)

    collection.add(
        ids=ids,
        embeddings=vectors,
        documents=texts,
        metadatas=metadatas
    )

    return collection

async def delete_vector_file(user_id: str, filename: str):
    client = chromadb.CloudClient(
        api_key=os.getenv("CHROMA_API_KEY"),
        tenant=os.getenv("CHROMA_TENANT"),
        database=os.getenv("CHROMA_DATABASE")
    )

    collection_name = f"rag_{user_id}"
    collection = client.get_collection(name=collection_name)

    # Fetch all documents with their IDs and metadata
    results = collection.get(
        where={"filename": filename}  # ✅ Filter directly by filename
    )

    # Delete all matching IDs at once
    if results["ids"]:
        collection.delete(ids=results["ids"])  # ✅ Bulk delete

    return {"message": f"Vector data for '{filename}' deleted successfully."}