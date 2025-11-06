import os
from typing import Dict, List, Any

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableParallel

from AI_Engine.rag.crisis_detection import detect_crisis

# Natural-language tools
import nltk
from nltk.tokenize import word_tokenize

# Download tokenizer resources
nltk.download('punkt', quiet=True)

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in the .env file")

EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
DB_FAISS_PATH = os.path.join(os.path.dirname(__file__), "../../vectorstore/db_faiss")

# Crisis response template
CRISIS_RESPONSE = (
    "⚠️ It sounds like you might be in immediate danger or considering self-harm.\n"
    "Please reach out immediately to local emergency services or helplines.\n"
    "In India: AASRA (91 9820466726), KIRAN (1800-599-0019), or dial 112 if necessary.\n"
    "You are not alone, please seek help now."
)

# Initialize LLM (Gemini)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=API_KEY,
    temperature=0.3,
    max_tokens=1024,
)

# Load embeddings and vectorstore
embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
vectorstore = FAISS.load_local(
    DB_FAISS_PATH,
    embeddings,
    allow_dangerous_deserialization=True,
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# Dynamic short acknowledgment list for detecting quick user confirmations
SHORT_ACK_WORDS = {
    "ok", "okay", "kk", "k", "thanks", "thank", "thank you", "alright", "fine",
    "sure", "cool", "yes", "yup", "yo", "got it", "nice", "sounds good"
}

def is_short_acknowledgment(text: str) -> bool:
    """
    Dynamically detect short acknowledgments (e.g. "ok", "thanks", "alright") by:
    - Checking length (<= 3 words and <= 15 chars)
    - Checking that all words are in known acknowledgment list
    """
    text = text.lower().strip()

    # Ignore messages longer than simple acknowledgment threshold
    if len(text) > 15 or len(text.split()) > 3:
        return False

    tokens = word_tokenize(text)
    return all(word in SHORT_ACK_WORDS for word in tokens)

qa_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are Reflecto, a warm and supportive mental health companion.\n"
        "You respond more like a thoughtful friend than a therapist or a chatbot.\n\n"
        "Your tone should be gentle, human, and emotionally present. Speak with empathy but do not overuse 'I understand' or 'it's okay to feel'.\n"
        "Be concise and only expand when it feels natural. Avoid formal therapeutic language or structured advice unless the user clearly asks for it.\n\n"
        "Key guidelines:\n"
        "- Keep the response grounded in the user's words and feelings.\n"
        "- If the dataset provides relevant info, subtly blend it in without sounding scripted.\n"
        "- If there's no relevant context, say so briefly and offer a human, general reflection.\n"
        "- No bullet points or numbered lists unless the user asks.\n"
        "- No markdown formatting, asterisks, bold, or underscores.\n"
        "- Use relatable examples, metaphors, or gentle reframes when helpful.\n"
        "- Keep follow-up questions subtle and caring—avoid making the user feel interrogated.\n\n"
        "Context from dataset (may or may not be relevant):\n{context}"
    ),
    MessagesPlaceholder("chat_history"),
    ("user", "{input}")
])


# Create language chain
langchain_rag = RunnableParallel(
    {
        "context": lambda x: "\n\n".join(
            [doc.page_content for doc in retriever.invoke(x["input"])]
        ),
        "chat_history": lambda x: x.get("chat_history", []),
        "input": lambda x: x["input"],
    }
).assign(answer=qa_prompt | llm)


def query_chain(
    question: str,
    chat_history: List[Any] = None,
    verbose: bool = False
) -> Dict[str, Any]:
    chat_history = chat_history or []

    # Crisis detection check
    is_crisis = detect_crisis(question)
    if is_crisis:
        return {"answer": CRISIS_RESPONSE, "crisis": True}

    # Detect and shortcut for short acknowledgments
    if is_short_acknowledgment(question):
        return {
            "answer": "You're most welcome 😊 Let me know if there's anything else I can help you with.",
            "crisis": False,
            "num_docs": 0,
        }

    try:
        response = langchain_rag.invoke(
            {"input": question, "chat_history": chat_history}
        )
        answer = response.get("answer", "Sorry, I couldn't process your request.")
        context = response.get("context", [])

        return {
            "answer": answer,
            "crisis": False,
            "num_docs": len(context),
            "context": context,
        }

    except Exception as e:
        return {
            "answer": f"Sorry, an error occurred while handling your message. ({str(e)})",
            "crisis": False,
            "num_docs": 0,
        }


def chatbot(
    question: str,
    chat_history: List[Any] = None
) -> Dict[str, Any]:
    return query_chain(question, chat_history)
