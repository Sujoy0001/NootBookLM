# NootBookLM 🧠✨

An intelligent, context-aware notebook and research assistant powered by LLMs and Retrieval-Augmented Generation (RAG). Upload documents, extract structured notes, ask grounded questions, and synthesize insights effortlessly.

---

## ⚡ Features

- **Document Ingestion:** Upload PDFs, Markdown, text files, and web links as knowledge sources.
- **Grounded Q&A (RAG):** Query your sources with strict factual grounding and inline citations.
- **Smart Note Generation:** Automatically generate summaries, study guides, outlines, and audio-style overviews.
- **Interactive UI:** Fast, responsive workspace designed for focused writing and research.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js / React, Tailwind CSS, Framer Motion
- **Backend:** FastAPI / Python (or Node.js)
- **Vector Database:** Chroma / Pinecone / Qdrant
- **LLM Orchestration:** Gemini API / LangChain / LlamaIndex

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone [https://github.com/Sujoy0001/NootBookLM.git](https://github.com/Sujoy0001/NootBookLM.git)
cd NootBookLM
```


GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_database_url
VECTOR_DB_URL=your_vector_db_url


# Frontend
npm install
npm run dev

# Backend (if separate)
pip install -r requirements.txt
uvicorn main:app --reload


├── frontend/       # Next.js UI components & pages
├── backend/        # API endpoints, RAG pipeline, and document loaders
├── vector_store/   # Embeddings and index management
└── README.md
