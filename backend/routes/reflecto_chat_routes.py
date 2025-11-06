# 📄 backend/routes/reflecto_chat_routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import sys

# Ensure backend root is accessible
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# Import Chat History Pipeline from AI Engine
from AI_Engine.rag.chat_history import ChatHistoryPipeline

# Create FastAPI router
router = APIRouter()
chat_pipeline = ChatHistoryPipeline()


class ChatRequest(BaseModel):
    user_id: str
    message: str


@router.post("/chat")
async def chat_with_reflecto(request: ChatRequest):
    """
    Reflecto RAG-based chatbot endpoint.
    Expects: user_id (str), message (str)
    Returns: AI answer + metadata (crisis flag, matched doc count)
    """
    try:
        if not request.user_id.strip() or not request.message.strip():
            raise HTTPException(status_code=400, detail="user_id and message are required")

        result = chat_pipeline.process(request.user_id, request.message)

        return {
            "status": "success",
            "answer": result.get("answer"),
            "num_docs": result.get("num_docs"),
            "crisis": result.get("crisis", False),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
