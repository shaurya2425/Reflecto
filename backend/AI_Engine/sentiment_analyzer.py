from textblob import TextBlob

def analyze_sentiment(text: str):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity

    if polarity > 0.2:
        sentiment = "positive"
    elif polarity < -0.2:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {
        "sentiment": sentiment,
        "polarity_score": polarity
    }

# ✅ This allows running the file standalone for quick testing
if __name__ == "__main__":
    # When you run: python AI_Engine/sentiment_analyzer.py
    print("🔍 Testing Sentiment Analyzer...\n")
    
    sample_text = input("Enter a sample journal entry: ")
    result = analyze_sentiment(sample_text)
    
    print("\n📊 Sentiment Analysis Result:")
    print(f"Sentiment: {result['sentiment']}")
    print(f"Polarity Score: {result['polarity_score']}")
