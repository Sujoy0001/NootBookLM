import os

import chromadb
from chromadb.config import Settings


import os

from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_text_splitters import CharacterTextSplitter

from langchain_chroma import Chroma

import requests
from langchain_core.embeddings import Embeddings

from dotenv import load_dotenv

load_dotenv()

class JinaEmbeddings(Embeddings):
    def __init__(self, api_key: str, model: str = "jina-embeddings-v4"):
        self.api_key = api_key
        self.model = model
        self.url = "https://api.jina.ai/v1/embeddings"

    def embed_documents(self, texts):
        response = requests.post(
            self.url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": self.model,
                "input": texts
            },
        )
        response.raise_for_status()
        data = response.json()["data"]
        return [item["embedding"] for item in data]

    def embed_query(self, text):
        return self.embed_documents([text])[0]
    


def load_documents(docs_path):

    print(f'Loading documents from {docs_path}...')

    if not os.path.exists(docs_path):
        raise FileNotFoundError(f"Directory '{docs_path}' does not exist.")
    
    loader = DirectoryLoader(
        path=docs_path,
        glob='**/*.txt',
        show_progress=True,
        silent_errors=True,
        loader_cls=TextLoader
    )
    
    documents = loader.load()

    if len(documents) == 0:
        raise FileNotFoundError(f"No .txt files found in directory '{docs_path}'.")
    
    for i, doc in enumerate(documents):
        print(f"\nDocument {i+1}:")
        print(f"  Source: {doc.metadata['source']}")
        print(f"  Content length: {len(doc.page_content)} characters")
        print(f"  Content preview: {doc.page_content[:100]}...")
        print(f"  metadata: {doc.metadata}")

    return documents



def split_documents(documents, chunk_size=300, chunk_overlap=0):
    text_splitter = CharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )

    chunks = text_splitter.split_documents(documents)

    if chunks:

        for i, chunk in enumerate(chunks):
            print(f"\n--- Chunk {i+1} ---")
            print(f"Source: {chunk.metadata['source']}")
            print(f"Length: {len(chunk.page_content)} characters")
            print(f"Content:")
            print(chunk.page_content)
            print("-" * 50)
        
        if len(chunks) > 5:
            print(f"\n... and {len(chunks) - 5} more chunks")

    return chunks


def create_vector_store(chunks):

    print("Connecting to Chroma Cloud...")

    # chroma_client = chromadb.HttpClient(
    #     host="api.trychroma.com",
    #     ssl=True,
    #     headers={
    #         "Authorization": f"Bearer {os.getenv('CHROMA_API_KEY')}",
    #         "X-Chroma-Tenant": os.getenv("CHROMA_TENANT"),
    #         "X-Chroma-Database": os.getenv("CHROMA_DATABASE"),
    #     }
    # )

    import chromadb

    client = chromadb.CloudClient(
        api_key='ck-9XaaH2SHrRtkN7bbuUxWfzjf48nQf7YH17TaMLeJ9myq',
        tenant='7ed67e47-e9bc-4fa8-8657-4da13b2127c9',
        database='RagLLM'
    )

    collection = client.get_or_create_collection(
        name="rag_documents",
        metadata={"hnsw:space": "cosine"}
    )

    jina_api_key = os.getenv("JINA_API_KEY")

    embeddings = JinaEmbeddings(
        api_key=jina_api_key,
        model="jina-embeddings-v4"
    )

    print("Generating embeddings and uploading to cloud...")

    texts = [chunk.page_content for chunk in chunks]
    metadatas = [chunk.metadata for chunk in chunks]
    ids = [f"chunk_{i}" for i in range(len(chunks))]

    vectors = embeddings.embed_documents(texts)

    collection.add(
        ids=ids,
        embeddings=vectors,
        documents=texts,
        metadatas=metadatas
    )

    print("Upload complete.")

    return collection

def main():
    docs_path = "../docs"

    print("Starting ingestion process...")

    documents = load_documents(docs_path)
    chunks = split_documents(documents)

    create_vector_store(chunks)

    print("Cloud ingestion finished.")


if __name__ == "__main__":
    main()