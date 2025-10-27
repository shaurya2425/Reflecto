# 📄 routes/journal_routes.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from datetime import datetime
from google.cloud import firestore
from google.oauth2 import service_account
import os

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
async def create_journal(entry: JournalCreate):
    try:
        data = entry.dict()
        data["created_at"] = datetime.utcnow()
        doc_ref = journals_ref.document()
        data["id"] = doc_ref.id
        doc_ref.set(data)
        return {"success": True, "message": "Journal entry added", "id": doc_ref.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Get All Journals by User UID
@router.get("/{user_uid}", summary="Get all journals for a user")
async def get_user_journals(user_uid: str):
    try:
        query = journals_ref.where("user_uid", "==", user_uid).order_by("created_at", direction=firestore.Query.DESCENDING)
        docs = query.stream()
        journals = [doc.to_dict() for doc in docs]
        return {"count": len(journals), "journals": journals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Update a Journal
@router.put("/{journal_id}", summary="Update journal entry by ID")
async def update_journal(journal_id: str, entry: JournalCreate):
    try:
        journal_doc = journals_ref.document(journal_id)
        if not journal_doc.get().exists:
            raise HTTPException(status_code=404, detail="Journal not found")
        journal_doc.update(entry.dict())
        return {"success": True, "message": "Journal updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Delete a Journal
@router.delete("/{journal_id}", summary="Delete a journal entry by ID")
async def delete_journal(journal_id: str):
    try:
        journal_doc = journals_ref.document(journal_id)
        if not journal_doc.get().exists:
            raise HTTPException(status_code=404, detail="Journal not found")
        journal_doc.delete()
        return {"success": True, "message": "Journal deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
