# 📄 main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.ai_routes import router as ai_router
from routes.journal_routes import router as journal_router

# ✅ Initialize FastAPI app
app = FastAPI(title="Reflecto AI Engine")

# ✅ Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify: ["http://localhost:5173", "http://127.0.0.1:5173"]
    allow_credentials=True,
    allow_methods=["*"],  # allows all methods: GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],  # allows all headers like Content-Type, Authorization, etc.
    expose_headers=["*"],   # 👈 add this

)

# ✅ Include routes
app.include_router(ai_router, prefix="/api/ai", tags=["AI Engine"])
app.include_router(journal_router, prefix="/api/journals", tags=["Journals"])

# ✅ Optional test route
@app.get("/")
def root():
    return {"message": "Reflecto AI backend is running 🚀"}
