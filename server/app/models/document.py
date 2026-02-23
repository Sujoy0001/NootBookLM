from pydantic import BaseModel, Field

class Document(BaseModel):
    id: str = Field(..., description="The unique identifier for the document")
    docs_url: str = Field(..., description="The URL where the document is stored")