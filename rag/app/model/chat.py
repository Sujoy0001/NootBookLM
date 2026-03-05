from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal, Optional
from bson import ObjectId


class ChatMessage(BaseModel):
    user_id: str
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    conversation_id: Optional[str] = None
