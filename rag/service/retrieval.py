from langchain_chroma import Chroma
from langchain_core.embeddings import Embeddings
from dotenv import load_dotenv
import os
import requests

from ingestion import JinaEmbeddings

load_dotenv()

persistent_directory = '../db/chroma_db'

jina_api_key = os.getenv("JINA_API_KEY")

    
embeddings = JinaEmbeddings(
                api_key=jina_api_key,
                model="jina-embeddings-v4"
            )

db = Chroma(
        persist_directory=persistent_directory,
        embedding_function=embeddings,
        collection_metadata={"hnsw:space": "cosine"}
    )

query = "What is RAG?"

retriever = db.as_retriever(search_kwargs={"k": 3})

results = retriever.invoke(query)

print(f"user query: {query}\n")

for i, result in enumerate(results,  1):
    print(f"Result {i}: {result.page_content}\n")