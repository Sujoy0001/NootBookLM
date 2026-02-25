import chromadb
from chromadb.api import ClientAPI
from chromadb.api.models.Collection import Collection
from fastapi import Depends
from dotenv import load_dotenv
import os


load_dotenv()

_clinet: ClientAPI | None = None
_collection: Collection | None = None

def get_chroma_client() -> ClientAPI:
    global _clinet
    if _clinet is None:
        _clinet = chromadb.CloudClient(
            api_key=os.getenv("JINA_API_KEY"),
            endpoint=os.getenv("CHROMA_ENDPOINT"),
            database=os.getenv("CHROMA_DATABASE")
        )
    return _clinet

def get_chroma_collection(client: ClientAPI = Depends(get_chroma_client)) -> Collection:
    global _collection
    if _collection is None:
        _collection = client.get_collection(name=os.getenv("CHROMA_COLLECTION"))
    return _collection