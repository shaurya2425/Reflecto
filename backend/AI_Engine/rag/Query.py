# backend/AI_Engine/rag/Query.py

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

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

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
    max_tokens=2048,
)

# Load embeddings and vectorstore
embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
vectorstore = FAISS.load_local(
    DB_FAISS_PATH,
    embeddings,
    allow_dangerous_deserialization=True,
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# Prompt for RAG conversation flow
qa_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are Reflecto, a gentle and supportive mental well-being assistant.\n"
        "Use CBT-style reframing and empathetic guidance.\n\n"
        "If context is provided, draw from it. Otherwise, say you lack specific dataset "
        "guidance and provide general support.\n"
        "Use 1–2 actionable steps and end with a soft follow-up question.\n"
        "{context}"
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
    is_crisis = detect_crisis(question)

    if is_crisis:
        return {"answer": CRISIS_RESPONSE, "crisis": True}

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
            "answer": f"Error: {str(e)}",
            "crisis": False,
            "num_docs": 0,
        }


def chatbot(
    question: str,
    chat_history: List[Any] = None
) -> Dict[str, Any]:
    return query_chain(question, chat_history)
