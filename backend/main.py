# 📄 main.py

from fastapi import FastAPI


from routes.ai_routes import router as ai_router
from routes.journal_routes import router as journal_router

app = FastAPI(title="Reflecto AI Engine")

# ✅ Include our new route
app.include_router(ai_router, prefix="/api/ai", tags=["AI Engine"])
app.include_router(journal_router, prefix="/api/journals", tags=["Journals"])

# optional test route
@app.get("/")
def root():
    return {"message": "Reflecto AI backend is running 🚀"}
