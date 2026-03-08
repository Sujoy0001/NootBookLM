# API Routes

This project interacts seamlessly with a Node.js / Express backend. Below is the specification for the API routes used.

## Endpoints Specification

### Authentication

- **POST `/api/auth/register`**
  - **Status:** Planned
  - **Description:** Register a new user (Backend implementation placeholder). Uses Firebase Auth tokens.

### Documents

- **POST `/api/upload`**
  - **Status:** Planned
  - **Description:** Upload PDF, MD, or TXT documents for RAG ingestion. Multipart form data.

- **GET `/api/documents`**
  - **Status:** Planned
  - **Description:** Retrieve all ingested documents metadata for the current user.

- **DELETE `/api/documents/:id`**
  - **Status:** Planned
  - **Description:** Delete a document from the vector store and database.

### Chat & Inference

- **POST `/api/chat`**
  - **Status:** Planned
  - **Description:** Send a prompt and receive a semantic search answer regarding your synced documents.
