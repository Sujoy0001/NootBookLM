from langchain_chroma import Chroma
from langchain_core.embeddings import Embeddings
from dotenv import load_dotenv
import os
import requests

from ingestion import JinaEmbeddings

# --- NEW IMPORTS FOR THE LLM PIPELINE ---
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

persistent_directory = '../db/chroma_db'
jina_api_key = os.getenv("JINA_API_KEY")

# LangChain's Gemini integration looks for the "GOOGLE_API_KEY" environment variable.
# Assuming you saved your key as GEMINI_API_KEY in your .env file, we map it here:
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY") 

embeddings = JinaEmbeddings(
    api_key=jina_api_key,
    model="jina-embeddings-v4"
)

db = Chroma(
    persist_directory=persistent_directory,
    embedding_function=embeddings,
    collection_metadata={"hnsw:space": "cosine"}
)

query = "capital of india?"

# Your existing retriever
retriever = db.as_retriever(search_kwargs={"k": 3})

# --- ADDING THE LLM AND CHAIN ---

# 1. Initialize the free-tier Gemini model
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)

# 2. Define the Prompt Template
template = """
You are a helpful AI assistant. Use the following pieces of retrieved context to answer the user's question.
If the answer is not in the context, just say that you don't know. Do not make up an answer.

Context:
{context}

Question:
{question}

Answer:
"""
prompt = PromptTemplate.from_template(template)

# 3. Create a helper function to format the retrieved documents into plain text
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 4. Build the RAG Chain
# This automatically passes the query to the retriever, formats the docs, injects the prompt, and calls Gemini.
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# 5. Execute the pipeline
print(f"User query: {query}\n")
print("Searching database and generating answer...\n")

# Invoke the chain instead of just the retriever
response = rag_chain.invoke(query)

print(f"Final Answer:\n{response}")