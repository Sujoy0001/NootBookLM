from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from ..v1.upload import upload_document_from_url_core
from ..v1.rag import ingest_user_documents_core
from ...model.url import URL

router = APIRouter()

@router.post("/url/uploads")
async def upload_document(payload: URL, background_tasks: BackgroundTasks):

    result = await upload_document_from_url_core(
        payload.user_id,
        str(payload.url)
    )

    if not result:
        raise HTTPException(status_code=400, detail="Failed to upload document")

    background_tasks.add_task(
        ingest_user_documents_core,
        payload.user_id
    )

    return JSONResponse(
        content={
            "version": "v2",
            "data": {
                "upload_result": result,
            },
            "ingestion": "Ingestion process has been triggered in the background. You can check the status in the logs."
        }
    )