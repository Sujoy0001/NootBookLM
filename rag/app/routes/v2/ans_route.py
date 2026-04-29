from fastapi import APIRouter

router = APIRouter()


@router.get("/query/ans/{user_id}")
async def query_ans(user_id: str, query: str):
    
    