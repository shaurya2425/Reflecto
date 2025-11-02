from datetime import datetime
from firebase_admin import firestore
from core.firebase import db
from DataEngine.models import Journal
from AI_Engine.sentiment_analyzer import analyze_sentiment

JOURNAL_COLLECTION = "journals"

# ✅ CREATE Journal
def create_journal(journal_data: Journal):
    print(journal_data.user_uid)
    sentiment_result = analyze_sentiment(journal_data.description)
    sentiment = sentiment_result["sentiment"]

    journal_dict = journal_data.model_dump()
    journal_dict["sentiment"] = sentiment
    journal_dict["created_at"] = datetime.now()
    journal_dict["updated_at"] = datetime.now()

    doc_ref = db.collection(JOURNAL_COLLECTION).document()
    doc_ref.set(journal_dict)
    return {**journal_dict, "id": doc_ref.id}

# ✅ READ All Journals for a User
def get_all_journals(user_id: str):
    print(user_id)
    # ✅ Use positional arguments instead of filter=
    docs = db.collection(JOURNAL_COLLECTION).where("user_uid", "==", user_id).stream()

    journals = []
    for doc in docs:
        journal = doc.to_dict()
        journal["id"] = doc.id
        newjournal = {"journal_id": doc.id,
                      **journal}
        journals.append(newjournal)
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

    # Re-run sentiment if description changes
    if "description" in updates:
        sentiment_result = analyze_sentiment(updates["description"])
        updates["sentiment"] = sentiment_result["sentiment"]

    doc_ref = db.collection(JOURNAL_COLLECTION).document(journal_id)
    doc = doc_ref.get()
    if not doc.exists:
        return None

    doc_ref.update(updates)
    updated = doc_ref.get().to_dict()
    updated["id"] = journal_id
    return updated

# ✅ DELETE Journal
def delete_journal(journal_id: str):
    doc_ref = db.collection(JOURNAL_COLLECTION).document(journal_id)
    if not doc_ref.get().exists:
        return False
    doc_ref.delete()
    return True
