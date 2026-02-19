from fastapi import APIRouter, UploadFile, File, HTTPException
from imagekit_client import imagekit
import uuid

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):

    # 1️⃣ Read file
    file_bytes = await file.read()

    # 2️⃣ Check size limit
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size must be under 5MB"
        )

    # 3️⃣ Generate unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    # 4️⃣ Upload to ImageKit
    upload_response = imagekit.files.upload(
        file=file_bytes,
        file_name=unique_filename,
    )

    return {
        "message": "File uploaded successfully",
        "file_name": upload_response.response_metadata.raw["name"],
        "file_url": upload_response.url,
        "file_id": upload_response.file_id
    }
