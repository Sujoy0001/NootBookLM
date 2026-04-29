from fastapi import APIRouter, HTTPException, Header, BackgroundTasks, Request
import datetime
from pydantic import BaseModel
from ...service.answerGeneration import generate_answer
from ...service.verfyUserID import verify_api_key
from ...database.firebase import get_rtdb_client
from ...utils.limiter import limiter

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

def update_usage_tracking(user_id: str):
    try:
        rtdb = get_rtdb_client()
        dashboard_ref = rtdb.reference(f'users/{user_id}/dashboard')
        dashboard = dashboard_ref.get()
        
        if not dashboard:
            return  # If the dashboard doesn't exist yet, we can't update it safely
            
        # 1. Update API Calls / Day in dashboardStats
        stats = dashboard.get("dashboardStats", [])
        for stat in stats:
            if stat.get("title") == "API Calls / Day":
                current_val = int(stat.get("value", "0"))
                stat["value"] = str(current_val + 1)
            # You can also increment API Calls / Min if you wish, though that usually requires a timestamp check
            
        # 2. Update apiChartData for the current day
        chart_data = dashboard.get("apiChartData", [])
        current_day = datetime.datetime.now().strftime("%a")  # e.g., "Mon", "Tue"
        for point in chart_data:
            if point.get("name") == current_day:
                point["calls"] = point.get("calls", 0) + 1
                
        # Push the updated arrays back to the database
        dashboard_ref.update({
            "dashboardStats": stats,
            "apiChartData": chart_data
        })
        
    except Exception as db_err:
        print(f"Warning: Failed to update usage tracking in RTDB: {db_err}")

@router.post("/chat/query")
@limiter.limit("5/minute;10/day")
async def chat_query(request: Request, payload: QueryRequest, background_tasks: BackgroundTasks, x_api_key: str = Header(None)):
    # Verify the API key and extract the user ID
    user_id = verify_api_key(x_api_key)

    # If the check is successful, call the query function
    try:
        answer = await generate_answer(
            user_id=user_id,
            query=payload.query
        )
        
        # Track usage in Realtime Database in the background so it doesn't slow down the response!
        background_tasks.add_task(update_usage_tracking, user_id)

        return {"answer": answer}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
