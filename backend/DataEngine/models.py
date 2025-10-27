from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Journal(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str = Field(..., description="Short title of the journal entry")
    description: str = Field(..., description="Detailed journal content")
    mood: str = Field(..., description="User mood selected from frontend")
    productivity: int = Field(..., ge=1, le=10, description="Productivity score 1–10")
    sentiment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
