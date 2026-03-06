# API Documentation

Base URL: `http://localhost:5000` (or your deployed URL)

## Authentication Endpoints

### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user account.
- **Request Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "mongo_user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### 2. Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticates an existing user and returns a JWT.
- **Request Body** (JSON):
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "token": "jwt_token_string",
    "user": {
      "id": "mongo_user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

## Document & RAG Endpoints

> **Note**: For all endpoints below, you must include the JWT token in the `x-auth-token` header.  
> Header: `x-auth-token: <your_jwt_token>`

### 3. Upload Documents
- **URL**: `/api/documents/upload`
- **Method**: `POST`
- **Description**: Uploads up to 3 documents (PDF, MD, TXT, DOCX), sends them to the RAG server, and triggers ingestion.
- **Headers**: 
  - `x-auth-token`: `jwt_token_string`
  - `Content-Type`: `multipart/form-data`
- **Request Body** (Form Data):
  - Key: `docs` | Value: File(s) (Max 3 files allowed)
- **Response** (200 OK):
  ```json
  {
    "message": "Documents successfully uploaded and ingested into RAG server.",
    "uploadDetails": { ... },
    "ingestDetails": { ... }
  }
  ```

### 4. Query Documents
- **URL**: `/api/rag/query`
- **Method**: `POST`
- **Description**: Queries the uploaded documents through the RAG system.
- **Headers**: 
  - `x-auth-token`: `jwt_token_string`
  - `Content-Type`: `application/json`
- **Request Body** (JSON):
  ```json
  {
    "query": "What are the main points extracted from the uploaded document?"
  }
  ```
- **Response** (200 OK): Returns the query response directly from the RAG server.

## General

### 5. Health Check
- **URL**: `/`
- **Method**: `GET`
- **Description**: Root endpoint to check if the API is running.
- **Response** (200 OK):
  ```text
  NotebookLM clone backend API is running!
  ```
