import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def generate_dynamic_advice(journal_text: str, sentiment_data: dict):
    prompt = f"""
    You are a mental health support AI, acting as a licensed therapist. You are provided with a user's journal entry and automated sentiment analysis.

    Journal Entry:
    "{journal_text}"

    Automated Analysis:
    - Sentiment Label: {sentiment_data['sentiment']}
    - Sarcasm Detected: {sentiment_data['sarcasm']}

    Your task is to provide a clinically-informed response in three parts:
    1. Emotional Summary — Briefly identify the core emotions or psychological states reflected in the entry.
    2. Empathetic Reflection — Write a validating paragraph that helps the user feel understood and seen. Avoid judgment and diagnosis. Reflect both the content and tone.
    3. Actionable Suggestions — Provide exactly 3 precise therapy-based suggestions (e.g., cognitive reframing, grounding techniques, expression practices, or ways to develop support systems). Each should be relevant to the journal entry context and practical for the user.

    CRUCIAL RESPONSE RULES:
    - Format output as strict JSON.
    - No emojis, no markdown, no asterisks, and no explanations outside the JSON.
    - Content must sound professional, empathetic, and human-like.
    - Do not use generic or repeated phrasing; personalize based on the user's journal.
    - Keep "reflection" under 80 words and each suggestion under 25 words.

    Response JSON structure:
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
    sample_sarcasm = input("Is it sarcastic? (sarcastic/not sarcastic): ")

    sentiment_data = {
        "sentiment": sample_sentiment,
        "sarcasm": sample_sarcasm
    }

    print("\n🔗 Connecting to Gemini and generating advice...")
    result = generate_dynamic_advice(sample_text, sentiment_data)

    if "error" in result:
        print("\n⚠️ Parsing Error:")
        print(result["raw_output"])
    else:
        print("\n🧭 Gemini Response:")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"Emotional Summary:\n{result['emotional_summary']}\n")
        print("Reflection:\n" + result['reflection'] + "\n")
        print("Suggestions:")
        for i, s in enumerate(result['suggestions'], 1):
            print(f"   {i}. {s}")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
