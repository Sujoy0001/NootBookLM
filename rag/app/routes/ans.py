from fastapi import APIRouter, HTTPException
from ..model.query import Query
from ..service.answerGeneration import generate_answer

router = APIRouter()

@router.post("/rag/query")
async def ask_question(payload: Query):
    try:
        answer = await generate_answer(
            user_id=payload.user_id,
            query=payload.query
        )

        return {
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))