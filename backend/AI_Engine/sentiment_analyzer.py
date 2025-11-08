import torch
from AI_Engine.model_loader import global_tokenizer, global_model, DEVICE, MAX_LEN, REVERSE_SENTIMENT, REVERSE_SARCASM

def analyze_sentiment(text: str):
    """Analyze sentiment and sarcasm using the trained RoBERTa model."""
    
    # Ensure the model is loaded
    if global_model is None or global_tokenizer is None:
        raise RuntimeError("❌ AI model is not initialized or failed to load.")

    # Tokenization and tensor conversion
    encoding = global_tokenizer.encode_plus(
        text, 
        max_length=MAX_LEN, 
        padding='max_length', 
        return_tensors='pt', 
        truncation=True
    )
    input_ids = encoding['input_ids'].to(DEVICE)
    attention_mask = encoding['attention_mask'].to(DEVICE)

    # Inference
    with torch.no_grad():
        sentiment_logits, sarcasm_logits = global_model(input_ids=input_ids, attention_mask=attention_mask)

    # Get predicted class (argmax)
    _, sentiment_pred = torch.max(sentiment_logits, dim=1)
    _, sarcasm_pred = torch.max(sarcasm_logits, dim=1)

    # Map to readable strings
    sentiment_label = REVERSE_SENTIMENT[sentiment_pred.item()]
    sarcasm_label = REVERSE_SARCASM[sarcasm_pred.item()]

    return {
        "sentiment": sentiment_label,
        "sarcasm": sarcasm_label
    }

# ✅ This allows running the file standalone for quick testing
if __name__ == "__main__":
    print("🔍 Testing Sentiment and Sarcasm Analyzer with RoBERTa...\n")

    sample_text = input("Enter a sample journal entry: ")
    result = analyze_sentiment(sample_text)

    print("\n📊 Analysis Result:")
    print(f"Sentiment: {result['sentiment']}")
    print(f"Sarcasm: {result['sarcasm']}")
