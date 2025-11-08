import torch
from transformers import RobertaTokenizer, RobertaModel
from .model_classes import RobertaMultiTaskClassifier
import os

# --- Configuration (Centralized Constants) ---
MODEL_NAME = 'roberta-large'
NEW_TOKENS = ['[POS]', '[NEU]', '[NEG]']
N_SENTIMENT_CLASSES = 3
N_SARCASM_CLASSES = 2
MAX_LEN = 128
# Paths are relative to the project root (../..)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "model_weights", "best_roberta_large_cueing_final.bin")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Reverse mappings
REVERSE_SENTIMENT = {0: 'positive', 1: 'neutral', 2: 'negative'}
REVERSE_SARCASM = {0: 'not sarcastic', 1: 'sarcastic'}

def load_and_initialize_model():
    """Loads the tokenizer and model with pretrained weights."""
    try:
        # Load tokenizer
        tokenizer = RobertaTokenizer.from_pretrained(MODEL_NAME)
        tokenizer.add_tokens(NEW_TOKENS)

        # Load base RoBERTa model
        roberta_model = RobertaModel.from_pretrained(MODEL_NAME)
        roberta_model.resize_token_embeddings(len(tokenizer))  # Resize token embeddings for new tokens

        # Initialize the multitask model with our custom head
        model = RobertaMultiTaskClassifier(
            roberta_model=roberta_model,
            n_sentiment_classes=N_SENTIMENT_CLASSES,
            n_sarcasm_classes=N_SARCASM_CLASSES
        )

        # Load trained weights
        model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
        model.to(DEVICE)
        model.eval()  # Set to evaluation mode

        print("✅ Model and tokenizer loaded successfully.")
        return tokenizer, model

    except Exception as e:
        print(f"❌ Error during model loading: {e}")
        return None, None

# Global variables for single loading instance
global_tokenizer, global_model = load_and_initialize_model()
