import os
import sys
from datetime import datetime, timedelta
import pytz

# ✅ Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.firebase import db

USER_UID = "73ezLUwABVP193lECv7IKYnKme22"
JOURNAL_COLLECTION = "journals"
IST = pytz.timezone("Asia/Kolkata")

def seed_streak_entries():
    print("🔥 Seeding 4-day streak entries for testing...")

    # Define "yesterday" as the start
    today = datetime.now(IST).date()
    streak_days = 4  # days before today

    for i in range(streak_days):
        entry_date = today - timedelta(days=streak_days - i)  # sequential order
        created_at = datetime.combine(entry_date, datetime.min.time()).replace(tzinfo=IST)

        entry = {
            "user_uid": USER_UID,
            "title": f"Streak Entry Day {i+1}",
            "description": f"This is streak day {i+1}. Mood and productivity are intentionally high.",
            "mood": 9,  # High to exceed threshold
            "productivity": 8,
            "sentiment": "positive",
            "sarcasm": "not sarcastic",
            "analysis": {"note": "Seeded for streak testing"},
            "created_at": created_at,
            "updated_at": created_at,
        }

        try:
            doc_ref = db.collection(JOURNAL_COLLECTION).document()
            doc_ref.set(entry)
            print(f"✅ Created streak entry for {entry_date} ({created_at})")

        except Exception as e:
            print(f"❌ Failed to create entry: {e}")
            break

    print("\n✅ Streak seed complete! 🏆")

if __name__ == "__main__":
    seed_streak_entries()
