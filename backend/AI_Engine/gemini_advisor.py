import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

DEBUG = True  # Set to False in production to suppress debug logs

def generate_dynamic_advice(journal_text: str, sentiment_data: dict):
    # Safely extract sentiment and sarcasm with default fallbacks
    sentiment = sentiment_data.get('sentiment', 'neutral')
    sarcasm = sentiment_data.get('sarcasm', 'not sarcastic')

    # Context-aware emotional interpretation
    if sarcasm == "sarcastic":
        if sentiment == "positive":
            true_tone = "masked frustration or conflict under a playful tone"
        elif sentiment == "neutral":
            true_tone = "detached or subtle dissatisfaction beneath an indifferent tone"
        elif sentiment == "negative":
            true_tone = "deep emotional difficulty or hurt masked with sarcastic humor"
        else:
            true_tone = "mixed emotions expressed indirectly with sarcasm"
    else:
        true_tone = f"a genuinely {sentiment} emotional state"

    # Build the Gemini prompt
    prompt = f"""
    You are an empathetic, licensed therapist AI. You receive a journal entry along with its automated AI analysis.
    
    Journal Entry:
    "{journal_text}"

    Automated Analysis:
    - Sentiment Label: {sentiment}
    - Sarcasm Detected: {sarcasm}

    Emotional Interpretation:
    - Based on sarcasm and sentiment data, the user's true emotional expression seems to reflect {true_tone}.

    Your task is to provide a human-sounding, supportive, thoughtful, three-part response:
    
    1. Emotional Summary — Identify the true emotional tone, considering sarcasm as a possible shield or indirect expression.
    2. Reflection — Validate the emotions with a light acknowledgment of their communication style (especially if sarcastic or humor-based), in a max of 80 words.
    3. Suggestions — Give exactly 3 tailored, relevant, therapy-aligned suggestions. 
       Each should be under 25 words.

    RULES:
    - Format strictly as JSON.
    - No emojis, no markdown, no code fencing.
    - No clinical diagnosis or judgment.
    - Balance clarity, kindness, and authenticity.

    Response Format:
    {{
        "emotional_summary": "...",
        "reflection": "...",
        "suggestions": ["...", "...", "..."]
    }}
    """

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        text = response.text.strip()

        if DEBUG:
            print("Gemini Raw Output:")
            print(text)

        # Clean the response from any code block fencing
        clean_text = re.sub(r"```json|```", "", text).strip()
        return json.loads(clean_text)

    except Exception as e:
        if DEBUG:
            print("⚠️ Gemini parsing failed:", e)
            print("Raw response:", response.text if 'response' in locals() else 'No response')

        return {
            "error": "AI analysis unavailable",
            "raw_output": response.text if 'response' in locals() else 'No response'
        }


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
        print("\n⚠️ Parsing/Error Warning:")
        print(result.get("raw_output", "No raw output available"))
    else:
        print("\n🧭 Gemini Response:")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"Emotional Summary:\n{result['emotional_summary']}\n")
        print("Reflection:\n" + result['reflection'] + "\n")
        print("Suggestions:")
        for i, s in enumerate(result['suggestions'], 1):
            print(f"   {i}. {s}")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
