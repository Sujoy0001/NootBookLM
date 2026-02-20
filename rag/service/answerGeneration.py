from langchain_chroma import Chroma
from langchain_core.embeddings import Embeddings
from dotenv import load_dotenv
import os
import requests

from ingestion import JinaEmbeddings
from langchain_core.messages import HumanMessage, SystemMessage

from google import genai

from langchain_google_genai import ChatGoogleGenerativeAI

from groq import Groq

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate


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


context_text = "\n\n".join(
    [f"[Result {i+1}]\n{doc.page_content}" for i, doc in enumerate(results)]
)

combined_context = f"""
Answer the question using ONLY the information provided below.
If the answer is not contained in the context, say "Insufficient information."

Context:
{context_text}

Question:
{query}
"""

llm = ChatGroq(
    model="llama3-8b-8192",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.2
)

formatted_context = "\n\n".join(doc.page_content for doc in results)

prompt = ChatPromptTemplate.from_template(
    """Answer the question using ONLY the information provided below.
If the answer is not contained in the context, say "Insufficient information."

Context:
{context}

Question:
{question}"""
)

messages = prompt.format_messages(
    context=formatted_context,
    question=query
)

result = llm.invoke(messages)

print("Generated answer:")
print(result.content)