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
    import re, json
    import google.generativeai as genai

    DEBUG = False

    # Extract sentiment and sarcasm safely
    sentiment = sentiment_data.get("sentiment", "neutral")
    sarcasm = sentiment_data.get("sarcasm", "not sarcastic")

    # Interpret emotional tone
    if sarcasm == "sarcastic":
        if sentiment == "positive":
            true_tone = "hidden frustration or emotional conflict behind a playful tone"
        elif sentiment == "neutral":
            true_tone = "quiet dissatisfaction masked with dry humor or detachment"
        elif sentiment == "negative":
            true_tone = "emotional pain or disappointment hidden behind sarcasm"
        else:
            true_tone = "mixed emotions expressed indirectly through sarcasm"
    else:
        true_tone = f"a genuinely {sentiment} emotional state"

    # Refined Gemini prompt
    prompt = f"""
    You are Reflecto — a calm, kind, and emotionally aware companion.
    You are not a therapist or coach. You respond like a real friend who listens deeply and speaks simply.

    You will receive a personal journal entry and a basic emotional analysis.
    Your goal is to write a natural, human-sounding reflection that gently mirrors the user’s tone and mood.

    Journal Entry:
    "{journal_text}"

    Automated Analysis:
    - Sentiment: {sentiment}
    - Sarcasm: {sarcasm}

    Emotional Understanding:
    - The user’s true emotional state seems to show {true_tone}.

    Write a three-part response in plain English with warmth, balance, and honesty.

    1. emotional_summary — Briefly describe the feeling you sense. Keep it human, not analytical.
       (Avoid long or formal sentences like a therapist. Keep it short and real.)
    2. reflection — Respond like a caring friend. Match the tone — if they sound tired, be gentle; if sarcastic, keep it lightly real.
       Acknowledge effort and emotion without clichés or over-reassurance. Stay under 80 words.
    3. suggestions — Offer exactly 3 small, thoughtful actions or reflections. 
       Keep each under 25 words. Avoid “fix yourself” or motivational language — focus on calm, real-life support.

    Example tone for reflection:
    - If the journal is heavy: soft, slow, grounded.
    - If it’s sarcastic: light empathy with a hint of shared humor.
    - If it’s calm or hopeful: gentle encouragement.
    - Never robotic or overly formal.

    RULES:
    - Output must be valid JSON.
    - Use simple words that anyone can understand.
    - No markdown, emojis, code fencing, or formatting symbols.
    - Keep it emotionally grounded, not scripted.

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

        # Clean possible code block wrappers
        clean_text = re.sub(r"```json|```", "", text).strip()
        return json.loads(clean_text)

    except Exception as e:
        if DEBUG:
            print("⚠️ Gemini parsing failed:", e)
            print("Raw response:", response.text if 'response' in locals() else 'No response')

        return {
            "error": "AI advice unavailable",
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
