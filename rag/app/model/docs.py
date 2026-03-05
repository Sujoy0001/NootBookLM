from pydantic import BaseModel, FilePath

class Document(BaseModel):
    User_id : str
    filename: str
    file_type: str
    size_bytes: int
    characters_extracted: int
    preview: str