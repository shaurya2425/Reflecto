# 📄 routes/ai_routes.py

from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import sys

# ✅ Ensure backend folder is in the Python import path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# ✅ Existing imports
from AI_Engine.sentiment_analyzer import analyze_sentiment
from AI_Engine.gemini_advisor import generate_dynamic_advice

# ✅ NEW: ChatHistoryPipeline from Reflecto RAG
from AI_Engine.rag.chat_history import ChatHistoryPipeline

pipeline = ChatHistoryPipeline()

# Create FastAPI router
router = APIRouter()
chat_pipeline = ChatHistoryPipeline()  # pipeline with Firestore + Query.py


class JournalRequest(BaseModel):
    entry: str


class ChatRequest(BaseModel):
    user_id: str
    session_id: str
    message: str


@router.post("/analyze-journal")
async def analyze_journal(request: JournalRequest):
    try:
        # Analyze sentiment + sarcasm using RoBERTa model
        sentiment_result = analyze_sentiment(request.entry)  # Now returns {'sentiment': ..., 'sarcasm': ...}

        # Generate dynamic advice based on the updated sentiment result
        gemini_result = generate_dynamic_advice(request.entry, sentiment_result)

        return {
            "status": "success",
            "sentiment_analysis": sentiment_result,  # Includes sentiment + sarcasm
            "gemini_advice": gemini_result           # Includes JSON from Gemini response
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")



@router.get("/chat/health")
async def chat_health():
    return {"ok": True, "service": "reflecto-chat", "stage": "rag-ready"}


@router.post("/chat")
async def chat_reflecto(request: ChatRequest):
    """
    Reflecto RAG-based chatbot with crisis detection and Firestore session-specific history.
    """
    try:
        if not request.user_id.strip() or not request.message.strip():
            raise HTTPException(status_code=400, detail="user_id and message are required")

        result = pipeline.process(
            user_id=request.user_id,
            session_id=request.session_id,
            query=request.message
        )

        return {
            "status": "success",
            "answer": result.get("answer"),
            "crisis": result.get("crisis", False),
            "num_docs": result.get("num_docs", 0)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


# ✅ For direct testing only
if __name__ == "__main__":
    app = FastAPI(title="Reflecto AI Route Tester")
    app.include_router(router, prefix="/api/ai")

    uvicorn.run(app, host="127.0.0.1", port=8001)
