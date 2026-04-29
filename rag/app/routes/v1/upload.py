from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from pathlib import Path
import os
import uuid
import docx 
from pypdf import PdfReader
import json
import httpx
from urllib.parse import urlparse

from ...database.mongodb import docs_collection 
from ...model.url import URL as UrlIngestionRequest

router = APIRouter()

UPLOAD_DIR = "uploads"                      
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  

SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
    ".md",
    ".py",
    ".js",
    ".ts",
    ".java",
    ".cpp",
    ".html",
    ".css",
    ".json",
}

def extract_pdf_text(path: str) -> str:
    text = ""
    reader = PdfReader(path)
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def extract_docx_text(path: str) -> str:
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs])


def extract_plain_text(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()
    
def extract_text_with_keys(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        data = json.load(f)
        
    texts = []
    
    def extract(obj, parent_key=""):
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_key = f"{parent_key}.{key}" if parent_key else key
                extract(value, new_key)

        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                extract(item, f"{parent_key}[{i}]")
        
        else:
            texts.append(f"{parent_key}: {obj}")

    extract(data)
    
    return "\n".join(texts)

def _build_document_name_from_url(source_url: str) -> str:
    parsed = urlparse(source_url)
    host = parsed.netloc.replace(".", "_") or "page"
    path_part = parsed.path.strip("/").replace("/", "_") or "root"
    return f"{host}_{path_part}.html"

async def _scrape_url_with_firecrawl(source_url: str) -> tuple[str, dict]:
    
    api_key = os.getenv("FIRECRAWL_API_KEY")
    
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="FIRECRAWL_API_KEY is missing. Add a free Firecrawl API key in env.",
        )

    endpoint = os.getenv("FIRECRAWL_BASE_URL", "https://api.firecrawl.dev") + "/v1/scrape"

    payload = {
        "url": source_url,
        "formats": ["markdown"],
        "onlyMainContent": True,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(endpoint, headers=headers, json=payload)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Firecrawl request failed: {str(exc)}")

    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Firecrawl error: {response.text}")

    firecrawl_data = response.json()
    content = (
        firecrawl_data.get("data", {}).get("markdown")
        or firecrawl_data.get("data", {}).get("content")
        or firecrawl_data.get("markdown")
        or firecrawl_data.get("content")
        or ""
    )

    if not isinstance(content, str) or not content.strip():
        raise HTTPException(status_code=400, detail="No extractable text found from URL")

    return content, firecrawl_data

async def upload_document_core(file, user_id: str):
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    original_name = Path(file.filename).name
    extension = Path(original_name).suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: '{extension}'")

    safe_name = f"{uuid.uuid4()}_{original_name}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    try:
        total_bytes = 0
        with open(file_path, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                total_bytes += len(chunk)
                if total_bytes > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE // (1024*1024)}MB"
                    )
                buffer.write(chunk)

        if extension == ".pdf":
            text = extract_pdf_text(file_path)
        elif extension == ".docx":
            text = extract_docx_text(file_path)
        else:
            text = extract_plain_text(file_path)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

    if not text.strip():
        raise HTTPException(status_code=400, detail="No extractable text found")
    
    
    existing_file = await docs_collection.find_one(
        {
            "user_id": user_id,
            "documents.filename": original_name
        }
    )

    if existing_file:
        raise HTTPException(
            status_code=400,
            detail="A file with this name already exists for this user."
        )

    document_data = {
        "filename": original_name,
        "file_type": extension,
        "size_bytes": total_bytes,
        "characters_extracted": len(text),
        "preview": text,
    }

    result = await docs_collection.update_one(
        {"user_id": user_id},         
        {
            "$push": {"documents": document_data}
        },
        upsert=True                
    )

    return {
        "message": "File uploaded and processed successfully",
        "file_info": {
            "filename": original_name,
            "size_bytes": total_bytes,
            "characters_extracted": len(text),
        },
    }


@router.post("/document/uploads")
async def upload_document(file: UploadFile = File(...), user_id: str = "anonymous"):
    
    result = await upload_document_core(file, user_id)
    
    return JSONResponse(
        content={
            "version" : "v1",
            "data": result
        }
    )


async def upload_document_from_url_core(user_id: str, source_url: str) -> dict:
    text, firecrawl_response = await _scrape_url_with_firecrawl(source_url)

    existing_url = await docs_collection.find_one(
        {
            "user_id": user_id,
            "documents.source_url": source_url,
        }
    )

    if existing_url:
        raise HTTPException(
            status_code=400,
            detail="This URL already exists for this user.",
        )

    filename = _build_document_name_from_url(source_url)
    size_bytes = len(text.encode("utf-8"))

    document_data = {
        "filename": filename,
        "file_type": ".html",
        "size_bytes": size_bytes,
        "characters_extracted": len(text),
        "preview": text,
        "source_url": source_url,
        "source": "firecrawl",
    }

    await docs_collection.update_one(
        {"user_id": user_id},
        {"$push": {"documents": document_data}},
        upsert=True,
    )

    page_title = (
        firecrawl_response.get("data", {}).get("metadata", {}).get("title")
        or firecrawl_response.get("metadata", {}).get("title")
    )

    return {
        "message": "URL fetched and processed successfully",
        "file_info": {
            "filename": filename,
            "source_url": source_url,
            "title": page_title,
            "size_bytes": size_bytes,
            "characters_extracted": len(text),
        },
    }
    
@router.post("/document/url")
async def upload_document_from_url(payload: UrlIngestionRequest):
    source_url = str(payload.url)
    user_id = payload.user_id
    
    result = await upload_document_from_url_core(user_id, source_url)
    
    return JSONResponse(
        content={
            "version": "v1",
            "data": result
        }
    )


@router.get("/documents/{user_id}")
async def list_user_documents(user_id: str):

    user_docs = await docs_collection.find_one({"user_id": user_id})

    if not user_docs or "documents" not in user_docs:
        raise HTTPException(status_code=404, detail="No documents found for this user")
    
    return JSONResponse(content={"documents": user_docs["documents"]})