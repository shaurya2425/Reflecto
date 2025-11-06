import csv, os
from typing import List
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

DATA_CSV = os.path.join(os.path.dirname(__file__), "../../DataEngine/data/reflecto_dataset.csv")
DB_FAISS_PATH = os.path.join(os.path.dirname(__file__), "../../vectorstore/db_faiss")
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

def load_csv_as_documents(path: str) -> List[Document]:
    docs = []
    with open(path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row.get("user_input") or not row.get("bot_response"):
                continue
            is_crisis = str(row.get("is_crisis", "0")).strip().lower() in {"1","true","yes"}
            preview = row["bot_response"][:220].replace("\n", " ")
            page_content = f"UserIntent: {row['user_input']}\nCuratedResponsePreview: {preview}"
            metadata = {
                "id": row.get("id") or "",
                "category": row.get("category") or "",
                "is_crisis": is_crisis,
                "full_response": row["bot_response"]
            }
            docs.append(Document(page_content=page_content, metadata=metadata))
    print(f"Loaded {len(docs)} docs from CSV")
    return docs

def build_index():
    docs = load_csv_as_documents(DATA_CSV)
    if not docs:
        raise RuntimeError("No documents loaded from CSV.")
    embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
    print("Building FAISS index...")
    db = FAISS.from_documents(docs, embeddings)
    os.makedirs(os.path.dirname(DB_FAISS_PATH), exist_ok=True)
    db.save_local(DB_FAISS_PATH)
    print(f"✅ Saved FAISS at {DB_FAISS_PATH}")

if __name__ == "__main__":
    build_index()
