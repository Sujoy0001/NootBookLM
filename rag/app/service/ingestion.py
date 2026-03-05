from langchain_core.documents import Document as LangDocument
from langchain_text_splitters import CharacterTextSplitter, RecursiveCharacterTextSplitter
from ..database.mongodb import docs_collection
import requests

async def load_user_documents(user_id: str):

    user_data = await docs_collection.find_one({"user_id": user_id})

    if not user_data or "documents" not in user_data:
        raise Exception("No documents found for this user")

    documents = []

    for doc in user_data["documents"]:
        documents.append(
            LangDocument(
                page_content=doc.get("full_text", doc.get("preview", "")),
                metadata={
                    "user_id": user_id,
                    "filename": doc.get("filename"),
                    "file_type": doc.get("file_type")
                }
            )
        )

    return documents


def split_documents(documents, chunk_size=500, chunk_overlap=100):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""]
    )

    return splitter.split_documents(documents)