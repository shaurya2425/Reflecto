# 📄 routes/journal_routes.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from datetime import datetime
from google.cloud import firestore
from google.oauth2 import service_account
import os
from DataEngine.crud_journal import get_all_journals, create_journal, update_journal, get_journal_by_id, delete_journal_entry


router = APIRouter()

# ✅ Firebase connection setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CRED_PATH = os.path.join(BASE_DIR, "firebase_secret.json")
creds = service_account.Credentials.from_service_account_file(CRED_PATH)
db = firestore.Client(credentials=creds)
journals_ref = db.collection("journals")

# ✅ Journal Schema (request validation)
class JournalCreate(BaseModel):
    user_uid: str = Field(..., description="Firebase User UID of logged-in user")
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    mood: int = Field(..., ge=1, le=10)
    productivity: int = Field(..., ge=1, le=10)
    sentiment: str | None = None
    polarity_score: float | None = None

# ✅ Create Journal Entry
@router.post("/", summary="Create a new journal entry")
async def create_journal_entry(entry: JournalCreate):
    try:
        print(entry.user_uid)
        result = create_journal(entry)
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Get All Journals by User UID
@router.get("/{user_uid}", summary="Get all journals for a user")
async def get_user_journals(user_uid: str):
    try:
        result = get_all_journals(user_uid)
        print(len(result))
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Update a Journal
@router.put("/{journal_id}", summary="Update journal entry by ID")
async def update_journal_entry(journal_id: str, entry: JournalCreate):
    try:
        result = update_journal(journal_id, entry.model_dump())
        return {
            "success": True,
            "message": "Journal updated successfully",
            "updated_entry": result
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Delete a Journal
@router.delete("/{journal_id}", summary="Delete a journal entry by ID")
async def delete_journal(journal_id: str):
    try:
        result = delete_journal_entry(journal_id)
        return {
            "success": True,
            "message": "Journal deleted successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
