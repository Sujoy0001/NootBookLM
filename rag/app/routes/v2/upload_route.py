from fastapi import APIRouter, UploadFile, File, HTTPException
from ..v1.upload import upload_document_core
from ..v1.rag import ingest_user_documents_core
from fastapi.responses import JSONResponse

from fastapi import BackgroundTasks

router = APIRouter()

@router.post("/document/uploads")
async def upload_document(file: UploadFile = File(...), user_id: str = "anonymous", BackgroundTasks: BackgroundTasks = None):
    
    result = await upload_document_core(file, user_id)
    
    if not result:
        raise HTTPException(status_code=400, detail="Failed to upload document")
    
    BackgroundTasks.add_task(ingest_user_documents_core, user_id)
    
    return JSONResponse(
        content={
            "version" : "v2",
            "data": {
                "upload_result": result,
            },
            "ingestion": "Ingestion process has been triggered in the background. You can check the status in the logs."
        }
    )
    