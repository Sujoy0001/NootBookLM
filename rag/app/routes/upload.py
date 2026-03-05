from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import os
import uuid
import docx 
from pypdf import PdfReader

from ..database.mongodb import docs_collection 
from ..model.docs import Document

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


@router.post("/document/uploads")
async def upload_document(file: UploadFile = File(...), user_id: str = "anonymous"):

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