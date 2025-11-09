from datetime import datetime
from firebase_admin import firestore
from core.firebase import db
from AI_Engine.sentiment_analyzer import analyze_sentiment
from AI_Engine.gemini_advisor import generate_dynamic_advice
from pydantic import BaseModel, Field
from datetime import datetime, timezone

JOURNAL_COLLECTION = "journals"

# Input schema from API request
class JournalCreate(BaseModel):
    user_uid: str = Field(..., description="Firebase User UID of logged-in user")
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    mood: int = Field(..., ge=1, le=10)
    productivity: int = Field(..., ge=1, le=10)


# ✅ CREATE Journal

def create_journal(journal_data: JournalCreate):
    print(f"👤 Creating journal for user: {journal_data.user_uid}")

    # 🔍 Run sentiment + sarcasm analysis and Gemini AI advice
    sentiment_result = analyze_sentiment(journal_data.description)
    analysis = generate_dynamic_advice(journal_data.description, sentiment_result)

    journal_dict = journal_data.model_dump()
    journal_dict["sentiment"] = sentiment_result["sentiment"]
    journal_dict["sarcasm"] = sentiment_result["sarcasm"]
    journal_dict["analysis"] = analysis
    
    # ✅ Use timezone-aware UTC datetime
    now = datetime.now(timezone.utc)
    journal_dict["created_at"] = now
    journal_dict["updated_at"] = now

    # ✅ Save to Firestore
    doc_ref = db.collection(JOURNAL_COLLECTION).document()
    doc_ref.set(journal_dict)
    return {**journal_dict, "id": doc_ref.id}


# ✅ READ All Journals for a User
def get_all_journals(user_id: str):
    print(f"📚 Fetching journals for user: {user_id}")
    docs = db.collection(JOURNAL_COLLECTION).where("user_uid", "==", user_id).stream()

    journals = []
    for doc in docs:
        journal = doc.to_dict()
        journal["id"] = doc.id
        journals.append(journal)
    
    return journals


# ✅ READ Journal by ID
def get_journal_by_id(journal_id: str):
    doc = db.collection(JOURNAL_COLLECTION).document(journal_id).get()
    if not doc.exists:
        return None

    journal = doc.to_dict()
    journal["id"] = doc.id
    return journal


# ✅ UPDATE Journal
def update_journal(journal_id: str, updates: dict):
    updates["updated_at"] = datetime.now()

    # 🔁 Re-run sentiment and AI analysis if description is updated
    if "description" in updates:
        sentiment_result = analyze_sentiment(updates["description"])
        updates["sentiment"] = sentiment_result["sentiment"]
        updates["sarcasm"] = sentiment_result["sarcasm"]
        updates["analysis"] = generate_dynamic_advice(updates["description"], sentiment_result)

    doc_ref = db.collection(JOURNAL_COLLECTION).document(journal_id)
    doc = doc_ref.get()
    if not doc.exists:
        return None

    doc_ref.update(updates)
    updated = doc_ref.get().to_dict()
    updated["id"] = journal_id
    return updated


# ✅ DELETE Journal
def delete_journal_entry(journal_id: str):
    doc_ref = db.collection(JOURNAL_COLLECTION).document(journal_id)
    if not doc_ref.get().exists:
        return False
    
    doc_ref.delete()
    return True
