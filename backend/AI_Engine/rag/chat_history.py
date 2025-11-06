# backend/AI_Engine/rag/chat_history.py

from datetime import datetime
from typing import Dict, List, Optional, Any
from langchain_core.messages import HumanMessage, AIMessage
from core.firebase import db as firestoreDB
from .Query import chatbot

class ChatHistoryPipeline:
    def __init__(self, db=None):
        self.db = db or firestoreDB
        self.collection = "users"
        self.subcollection = "chat_history"
        self.history_limit = 14  # Max messages per chat history

    def _chat_ref(self, user_id: str, session_id: str):
        """
        Add session_id separation so each chat remains isolated.
        """
        return (
            self.db.collection(self.collection)
            .document(user_id)
            .collection(f"{self.subcollection}_{session_id}")
        )

    def retrieve_history(self, user_id: str, session_id: str) -> List:
        """
        Retrieve history for given user and session_id
        """
        try:
            docs = (
                self._chat_ref(user_id, session_id)
                .order_by("timestamp", direction="DESCENDING")
                .limit(self.history_limit)
                .stream()
            )

            messages = []
            for doc in list(docs)[::-1]:
                data = doc.to_dict()
                if data.get("role") == "user":
                    messages.append(HumanMessage(content=data.get("content", "")))
                elif data.get("role") == "assistant":
                    messages.append(AIMessage(content=data.get("content", "")))
            return messages
        except Exception as e:
            print(f"[ChatHistoryPipeline] Error fetching history: {e}")
            return []

    def store(self, user_id: str, session_id: str, role: str, content: Any, metadata: Optional[Dict] = None):
        """
        Store a single message in the session-specific chat history
        """
        try:
            if hasattr(content, "content"):
                content = content.content  # Strip LLM wrapper

            self._chat_ref(user_id, session_id).add({
                "role": role,
                "content": content,
                "timestamp": datetime.utcnow(),
                "metadata": metadata or {}
            })
            return True
        except Exception as e:
            print(f"[ChatHistoryPipeline] Error storing message: {e}")
            return False

    def process(self, user_id: str, session_id: str, query: str) -> Dict[str, any]:
        """
        Main function: retrieves session-specific history, runs chatbot, stores result.
        """
        history = self.retrieve_history(user_id, session_id)
        result = chatbot(query, history)

        result.setdefault("num_docs", 0)
        result.setdefault("crisis", False)

        self.store(user_id, session_id, "user", query)
        self.store(
            user_id, session_id, "assistant", result["answer"],
            {"num_docs": result["num_docs"], "crisis": result.get("crisis")}
        )
        return result
