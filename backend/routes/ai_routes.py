# 📄 routes/ai_routes.py

from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import os
import sys

# ✅ Ensure parent (backend) folder is in sys.path for imports
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# ✅ Use absolute imports (not relative)
from AI_Engine.sentiment_analyzer import analyze_sentiment
from AI_Engine.gemini_advisor import generate_dynamic_advice


# Create FastAPI router 
router = APIRouter()


class JournalRequest(BaseModel):
    entry: str


@router.post("/analyze-journal")
async def analyze_journal(request: JournalRequest):
    """
    Combines sentiment analysis + Gemini advice generation.
    Input: journal entry text
    Output: sentiment + AI advice
    """
    try:
        sentiment_result = analyze_sentiment(request.entry)
        gemini_result = generate_dynamic_advice(request.entry, sentiment_result)

        return {
            "status": "success",
            "sentiment_analysis": sentiment_result,
            "gemini_advice": gemini_result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ✅ For direct testing only
if __name__ == "__main__":
    app = FastAPI(title="Reflecto AI Route Tester")
    app.include_router(router, prefix="/api/ai")

    # 👉 Use uvicorn directly, no 'reload' here
    uvicorn.run(app, host="127.0.0.1", port=8001)
