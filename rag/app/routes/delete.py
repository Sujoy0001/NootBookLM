from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from ..database.mongodb import docs_collection
from ..utils.chroma import delete_user_vector_files, delete_vector_file

router = APIRouter()

@router.delete("/user/delete/{user_id}")
async def delete_user_data(user_id: str):

    result = await docs_collection.delete_one({"user_id": user_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User data not found")
    
    result = await delete_user_vector_files(user_id)

    context = {
        "message": f"All data for user '{user_id}' deleted successfully from mongodb.",
        "vector_deletion": result
    }

    return JSONResponse(content=context)

@router.delete("/document/{user_id}/{filename}")
async def delete_user_document(user_id: str, filename: str):

    result = await docs_collection.update_one(
        {"user_id": user_id},
        {"$pull": {"documents": {"filename": filename}}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Document not found for this user")
    
    result = await delete_vector_file(user_id, filename)

    context = {
        "message": f"Document '{filename}' deleted successfully for user '{user_id}' from mongodb.",
        "vector_deletion": result
    }
    
    return JSONResponse(content=context)