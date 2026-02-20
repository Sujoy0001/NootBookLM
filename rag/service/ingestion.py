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



def split_documents(documents, chunk_size=1000, chunk_overlap=0):
    text_splitter = CharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )

    chunks = text_splitter.split_documents(documents)

    if chunks:

        for i, chunk in enumerate(chunks[:5]):
            print(f"\n--- Chunk {i+1} ---")
            print(f"Source: {chunk.metadata['source']}")
            print(f"Length: {len(chunk.page_content)} characters")
            print(f"Content:")
            print(chunk.page_content)
            print("-" * 50)
        
        if len(chunks) > 5:
            print(f"\n... and {len(chunks) - 5} more chunks")

    return chunks

def create_vector_store(chunks, persist_directory='db/chroma_db'):

    print(f'Creating vector store in {persist_directory}...')

    jina_api_key = os.getenv("JINA_API_KEY")

    if not jina_api_key:
        raise ValueError("JINA_API_KEY not found in environment variables. Please set it in your .env file.")

    embeddings = JinaEmbeddings(
        api_key=jina_api_key,
        model="jina-embeddings-v4"
    )

    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory,
        collection_metadata={"hnsw:space": "cosine"}
    )

    vector_store.persist() 

    print("embeddings created and vector store initialized")

    return vector_store


def main():
    docs_path = '../docs'
    db_path = 'db/chroma_db'

    print("Starting ingestion process...")

    if os.path.exists(db_path):
        print(f"vector store already exists at '{db_path}'. Skipping vector store creation.")

        embeddings = JinaEmbeddings(
            api_key=os.getenv("JINA_API_KEY"),
            model="jina-embeddings-v4"
        )

        vector_store = Chroma(
            persist_directory=db_path,
            embedding_function=embeddings,
            collection_metadata={"hnsw:space": "cosine"}
        )
        
        print(f"Loaded existing vector store with {vector_store._collection.count()} documents")

        return vector_store
    
    documents = load_documents(docs_path)

    chunks = split_documents(documents)

    vector_store = create_vector_store(chunks, persist_directory=db_path)

    print("Persisting vector store...")

    return vector_store


if __name__ == "__main__":
    main()