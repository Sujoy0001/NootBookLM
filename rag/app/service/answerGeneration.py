import os
from dotenv import load_dotenv
from datetime import datetime

from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from ..utils.jina import JinaEmbeddings
# from database.mongodb import chat_collection

load_dotenv()

CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")


embeddings = JinaEmbeddings(
    api_key=os.getenv("JINA_API_KEY"),
    model="jina-embeddings-v4"
)


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.3
)


template = """
    You are an expert AI assistant.

    You must answer the user's question using ONLY the provided context.
    Do NOT use prior knowledge.
    Do NOT make assumptions.
    Do NOT hallucinate.

    If the answer cannot be found explicitly in the context, respond with:
    "I don't know based on the provided context."

    ---------------------
    CONTEXT:
    {context}
    ---------------------

    USER QUESTION:
    {question}

    INSTRUCTIONS:
    - Provide a clear and concise answer.
    - Base every statement strictly on the context.
    - If multiple pieces of context are relevant, combine them logically.
    - Do not mention the word "context" in your answer.
    - Do not explain your reasoning.
    - Return only the final answer.

    ANSWER:
"""

prompt = PromptTemplate.from_template(template)
parser = StrOutputParser()


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)



def get_user_vectorstore(user_id: str):
    """
    Create Chroma Cloud instance for specific user collection
    """
    collection_name = f"rag_{user_id}"

    return Chroma(
        collection_name=collection_name,
        embedding_function=embeddings,
        tenant=CHROMA_TENANT,
        database=CHROMA_DATABASE,
        chroma_cloud_api_key=CHROMA_API_KEY
    )


async def generate_answer(user_id: str, query: str):


    db = get_user_vectorstore(user_id)

    retriever = db.as_retriever(search_kwargs={"k": 3})

    docs = retriever.invoke(query)
    context = format_docs(docs)


    final_prompt = prompt.invoke({
        "context": context,
        "question": query
    })


    response = await llm.ainvoke(final_prompt)
    answer = parser.invoke(response)


    return answer