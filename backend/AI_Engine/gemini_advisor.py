import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

def generate_dynamic_advice(journal_text: str, sentiment_data: dict):
    prompt = f"""
    You are a licensed therapist AI assistant analyzing a user's journal entry.
    
    Here is the journal entry:
    "{journal_text}"

    Sentiment analysis result:
    - Sentiment: {sentiment_data['sentiment']}
    - Polarity Score: {sentiment_data['polarity_score']}

    Based on this, provide:
    1. A brief emotional summary (what emotions you sense).
    2. One paragraph of empathetic reflection (show understanding of their mood).
    3. Three personalized therapy-based advice points to help them feel better or grow.
    
    Output must be in clean JSON format:
    {{
        "emotional_summary": "...",
        "reflection": "...",
        "suggestions": ["...", "...", "..."]
    }}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")

    response = model.generate_content(prompt)
    text = response.text

    import json, re
    try:
        clean_text = re.sub(r"```json|```", "", text).strip()
        data = json.loads(clean_text)
    except Exception:
        data = {"error": "Failed to parse Gemini response", "raw_output": text}

    return data

# ✅ Test Gemini function standalone
if __name__ == "__main__":
    print("🤖 Testing Gemini Advisor...\n")

    sample_text = input("Enter a sample journal entry: ")
    sample_sentiment = input("Enter sentiment (positive/negative/neutral): ")
    sample_score = float(input("Enter polarity score (e.g., 0.5 or -0.3): "))

    sentiment_data = {
        "sentiment": sample_sentiment,
        "polarity_score": sample_score
    }

    print("\n🔗 Connecting to Gemini and generating advice...")
    result = generate_dynamic_advice(sample_text, sentiment_data)

    print("\n🧭 Gemini Response (Clean View):")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"🩵 Emotional Summary:\n{result['emotional_summary']}\n")
    print("💬 Reflection:\n" + result['reflection'] + "\n")
    print("🌱 Suggestions:")
    for i, s in enumerate(result['suggestions'], 1):
        print(f"   {i}. {s}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
