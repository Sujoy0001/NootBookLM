from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal, Optional
from bson import ObjectId


class ChatMessage(BaseModel):
    query: str
