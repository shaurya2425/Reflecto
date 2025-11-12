# Reflecto

A comprehensive mental health journaling application powered by AI-driven sentiment analysis, personalized advice generation, and an intelligent RAG-based chatbot companion.

## Overview

Reflecto is a full-stack web application designed to support mental wellness through structured journaling, real-time emotional analysis, and AI-powered guidance. The platform combines deep learning models for sentiment and sarcasm detection with large language models to provide empathetic, context-aware responses to users' journal entries and conversational queries.

### Core Capabilities

- **Intelligent Journaling**: Users create journal entries with mood and productivity ratings, which are automatically analyzed for sentiment and sarcasm using a fine-tuned RoBERTa model
- **AI-Powered Insights**: Gemini 2.5 Flash generates personalized, therapeutic-style advice based on sentiment analysis results
- **RAG-Based Chatbot**: Context-aware conversational AI that retrieves relevant information from a curated mental health dataset using FAISS vector search
- **Crisis Detection**: Automated detection of crisis-related language with immediate helpline referrals
- **Analytics Dashboard**: Comprehensive trend analysis, mood tracking, and productivity correlation insights
- **Session Management**: Isolated chat sessions with persistent history stored in Firestore

## Tech Stack

### Backend

| Component | Technology | Version/Purpose |
|-----------|-----------|-----------------|
| **Framework** | FastAPI | 0.120.0 |
| **Database** | Firebase Firestore | Cloud NoSQL |
| **Authentication** | Firebase Admin SDK | Service account-based |
| **ML Framework** | PyTorch | Deep learning inference |
| **NLP Model** | RoBERTa-Large | Fine-tuned for sentiment & sarcasm |
| **LLM** | Google Gemini 2.5 Flash | Advice generation & chatbot |
| **Vector Store** | FAISS | Semantic search (RAG) |
| **Embeddings** | HuggingFace (sentence-transformers/all-MiniLM-L6-v2) | Text vectorization |
| **LangChain** | LangChain Core/Community | RAG pipeline orchestration |
| **Server** | Uvicorn | ASGI server |

### Frontend

| Component | Technology | Version/Purpose |
|-----------|-----------|-----------------|
| **Framework** | React | 19.1.1 |
| **Build Tool** | Vite | 7.1.2 |
| **Routing** | React Router DOM | 7.9.1 |
| **UI Components** | Radix UI + shadcn/ui | Accessible component library |
| **Styling** | Tailwind CSS | 4.1.13 |
| **Charts** | Recharts | 2.15.4 |
| **Authentication** | Firebase Auth | Client-side auth |
| **Forms** | React Hook Form + Zod | Form validation |

## Project Structure

```
Reflecto/
├── backend/                    # FastAPI backend service
│   ├── AI_Engine/             # Core AI/ML components
│   │   ├── emotion_detector.py
│   │   ├── gemini_advisor.py  # Gemini LLM integration
│   │   ├── sentiment_analyzer.py  # RoBERTa inference
│   │   ├── model_loader.py    # Model initialization
│   │   ├── model_classes.py   # PyTorch model architecture
│   │   └── rag/               # RAG system
│   │       ├── Query.py       # Main RAG pipeline
│   │       ├── chat_history.py # Session management
│   │       ├── crisis_detection.py
│   │       └── BuildStore.py  # Vector store builder
│   ├── core/                  # Core utilities
│   │   ├── config.py         # Configuration management
│   │   ├── firebase.py        # Firebase initialization
│   │   └── dependencies.py
│   ├── DataEngine/            # Data access layer
│   │   ├── models.py          # Pydantic models
│   │   ├── crud_journal.py    # Journal CRUD operations
│   │   ├── crud_analytics.py
│   │   ├── crud_user.py
│   │   └── db.py
│   ├── routes/                # API route handlers
│   │   ├── ai_routes.py       # AI analysis endpoints
│   │   ├── journal_routes.py  # Journal CRUD endpoints
│   │   ├── analytics_routes.py
│   │   └── reflecto_chat_routes.py
│   ├── Utils/                 # Helper utilities
│   ├── vectorstore/           # FAISS index storage
│   ├── model_weights/         # Trained RoBERTa weights
│   ├── main.py                # FastAPI app entry point
│   └── requirements.txt
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── NewEntryForm.jsx
│   │   │   ├── PastEntriesList.jsx
│   │   │   ├── AnalyticsModal.jsx
│   │   │   └── ...
│   │   ├── pages/            # Route pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── JournalPage.jsx
│   │   │   ├── ChatbotPage.jsx
│   │   │   └── ...
│   │   ├── context/          # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── services/         # API clients
│   │   │   └── firebase.js
│   │   └── App.jsx           # Root component
│   └── package.json
│
└── docs/                      # Documentation
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Journal  │  │ Chatbot  │  │Analytics │  │ Profile  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │              │         │
│       └─────────────┴──────────────┴──────────────┘         │
│                        │                                     │
│                   AuthContext                               │
└────────────────────────┼─────────────────────────────────────┘
                          │ HTTP/REST
┌─────────────────────────┼─────────────────────────────────────┐
│                  Backend (FastAPI)                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Routes Layer                         │   │
│  │  /api/journals  /api/ai  /api/analytics  /api/chat  │   │
│  └────────────┬─────────────────────────────────────────┘   │
│               │                                               │
│  ┌────────────┴─────────────────────────────────────────┐   │
│  │              Business Logic Layer                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │   │
│  │  │ CRUD Ops     │  │ AI Engine    │  │ Analytics│  │   │
│  │  └──────┬───────┘  └──────┬───────┘  └────┬─────┘  │   │
│  └─────────┼──────────────────┼───────────────┼────────┘   │
│            │                  │               │              │
│  ┌─────────┴──────────────────┴───────────────┴────────┐  │
│  │              AI/ML Processing Layer                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │  │
│  │  │ RoBERTa      │  │ Gemini 2.5   │  │ RAG       │  │  │
│  │  │ Sentiment    │  │ Flash        │  │ Pipeline  │  │  │
│  │  │ + Sarcasm    │  │ (Advice)     │  │ (Chatbot) │  │  │
│  │  └──────────────┘  └──────────────┘  └─────┬────┘  │  │
│  └─────────────────────────────────────────────┼───────┘  │
│                                                 │           │
│  ┌─────────────────────────────────────────────┴────────┐ │
│  │              Data Layer                                │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │ │
│  │  │ Firestore    │  │ FAISS        │  │ Model    │  │ │
│  │  │ (Journals,   │  │ Vectorstore  │  │ Weights  │  │ │
│  │  │  Chat History)│  │ (RAG Index)  │  │ (RoBERTa)│  │ │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## Key Features

### 1. Journal Entry Analysis

**Workflow:**
1. User submits journal entry with title, description, mood (1-10), and productivity (1-10)
2. Backend processes entry through RoBERTa model for sentiment (positive/neutral/negative) and sarcasm detection
3. Sentiment results inform Gemini 2.5 Flash prompt for generating personalized advice
4. Advice includes: emotional summary, reflection (max 80 words), and 3 tailored suggestions
5. Complete analysis stored in Firestore with timestamps

**Technical Details:**
- RoBERTa-Large fine-tuned on custom dataset with multi-task learning (sentiment + sarcasm)
- Model uses special tokens `[POS]`, `[NEU]`, `[NEG]` for enhanced cueing
- Gemini prompt dynamically adjusts based on sarcasm detection (accounts for masked emotions)
- Analysis stored as nested JSON in journal document

### 2. RAG-Based Chatbot

**Architecture:**
- **Vector Store**: FAISS index built from `reflecto_dataset.csv` (mental health Q&A pairs)
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional vectors)
- **Retrieval**: Top-k (k=5) semantic similarity search
- **LLM**: Gemini 2.5 Flash with temperature=0.3 for consistent responses
- **History Management**: Session-isolated chat history in Firestore (14-message limit)

**Features:**
- Crisis detection via regex pattern matching (triggers immediate helpline response)
- Short acknowledgment detection (e.g., "ok", "thanks") for natural conversation flow
- Context-aware responses that blend retrieved dataset knowledge with conversational history
- Human-like tone (avoids formal therapeutic language)

### 3. Analytics & Trends

**Metrics Computed:**
- **Daily Averages**: Mood, productivity, combined score, energy score, sentiment score
- **Sentiment Distribution**: Counts of positive/neutral/negative entries per day
- **Correlations**: Mood vs. productivity correlation coefficient
- **Streaks**: Current and best consecutive journaling streaks
- **Highlights**: Best and toughest days based on combined score

**Date Ranges Supported:**
- 7 days, 30 days, 6 months, 1 year

**Scoring Algorithm:**
- Combined Score: `0.5 × mood + 0.3 × productivity + 0.2 × (sentiment × sarcasm_factor)`
- Energy Score: `(mood × productivity) / 10`
- Sarcasm factor: 0.9 if sarcastic, 1.0 otherwise

### 4. User Authentication & Data Isolation

- Firebase Authentication for user management
- All journal entries and chat sessions scoped by `user_uid`
- Session-based chat history isolation (`chat_history_{session_id}` subcollections)
- Protected routes with React Router authentication guards

## Design Decisions

### 1. Multi-Task Learning for Sentiment Analysis

**Decision**: Use a single RoBERTa model with dual classification heads (sentiment + sarcasm) instead of separate models.

**Rationale**:
- Shared encoder learns common linguistic features
- Reduces inference latency (single forward pass)
- Sarcasm detection improves sentiment interpretation accuracy
- Model weights stored locally for offline inference capability

### 2. RAG Architecture for Chatbot

**Decision**: Implement Retrieval-Augmented Generation instead of fine-tuning a chatbot model.

**Rationale**:
- Curated dataset ensures safe, appropriate responses
- Easy to update knowledge base without retraining
- Reduces hallucination risk
- Cost-effective (smaller context window needed)

### 3. Session-Based Chat History

**Decision**: Store chat history in session-specific Firestore subcollections.

**Rationale**:
- Enables multiple concurrent conversations
- Clean separation for analytics and debugging
- Scalable to future features (chat export, session sharing)
- 14-message limit prevents context window overflow

### 4. Firebase Firestore for Primary Storage

**Decision**: Use Firestore instead of traditional SQL database.

**Rationale**:
- Seamless integration with Firebase Auth
- Real-time capabilities for future features
- NoSQL flexibility for nested analysis JSON
- Serverless scaling without infrastructure management

### 5. FastAPI for Backend Framework

**Decision**: Choose FastAPI over Flask or Django.

**Rationale**:
- Automatic OpenAPI documentation
- Async/await support for concurrent requests
- Type validation with Pydantic models
- High performance (comparable to Node.js)

### 6. Component-Based Frontend Architecture

**Decision**: Use React with shadcn/ui component library.

**Rationale**:
- Reusable, accessible UI components
- Consistent design system
- Type-safe form validation with Zod
- Modern React patterns (hooks, context)

## Component Architecture

### Backend Components

#### `AI_Engine/sentiment_analyzer.py`
- **Purpose**: RoBERTa model inference wrapper
- **Input**: Raw journal text (string)
- **Output**: `{sentiment: str, sarcasm: str}`
- **Dependencies**: `model_loader.py` (global model instance)

#### `AI_Engine/gemini_advisor.py`
- **Purpose**: Generate therapeutic advice from journal + sentiment
- **Input**: Journal text, sentiment dict
- **Output**: JSON with `emotional_summary`, `reflection`, `suggestions[]`
- **Key Feature**: Sarcasm-aware prompt engineering

#### `AI_Engine/rag/Query.py`
- **Purpose**: RAG pipeline orchestration
- **Components**:
  - FAISS retriever (k=5)
  - LangChain RunnableParallel for context retrieval
  - Gemini LLM with system prompt
  - Crisis detection pre-filter
- **Output**: `{answer: str, crisis: bool, num_docs: int}`

#### `DataEngine/crud_journal.py`
- **Purpose**: Journal CRUD operations with AI analysis integration
- **Flow**: Create → Analyze → Store (atomic operation)
- **Updates**: Re-runs analysis if description changes

#### `routes/analytics_routes.py`
- **Purpose**: Time-series analytics computation
- **Optimization**: Single Firestore query with date range filtering
- **Timezone**: IST (Asia/Kolkata) for date bucketing

### Frontend Components

#### `AuthContext.jsx`
- **Purpose**: Global authentication state management
- **Pattern**: React Context + Firebase `onAuthStateChanged` listener
- **Exports**: `useAuth()` hook

#### `NewEntryForm.jsx`
- **Purpose**: Journal entry creation form
- **Validation**: React Hook Form + Zod schema
- **Submission**: POST to `/api/journals/` with user_uid

#### `ChatbotPage.jsx`
- **Purpose**: RAG chatbot interface
- **State**: Message history, session_id (UUID)
- **API**: POST to `/api/ai/chat` with user_id, session_id, message

#### `AnalyticsModal.jsx`
- **Purpose**: Trend visualization dashboard
- **Charts**: Recharts (line charts for trends, bar charts for sentiment)
- **Filters**: Date range selector (7d, 30d, 6mo, 1y)

## Data Flow

### Journal Entry Creation Flow

```
User Input (Frontend)
    ↓
POST /api/journals/
    ↓
JournalCreate (Pydantic validation)
    ↓
crud_journal.create_journal()
    ↓
┌─────────────────────────────┐
│ 1. analyze_sentiment()      │ → RoBERTa inference
│    → {sentiment, sarcasm}   │
│                             │
│ 2. generate_dynamic_advice()│ → Gemini API call
│    → {emotional_summary,    │
│       reflection,           │
│       suggestions[]}        │
└─────────────────────────────┘
    ↓
Firestore: journals collection
    ↓
Response: Complete journal object with id
    ↓
Frontend: Display analysis in modal
```

### Chatbot Query Flow

```
User Message (Frontend)
    ↓
POST /api/ai/chat
    ↓
ChatHistoryPipeline.process()
    ↓
┌─────────────────────────────┐
│ 1. retrieve_history()       │ → Firestore query
│    → List[HumanMessage,     │   (session-specific)
│         AIMessage]          │
│                             │
│ 2. chatbot()                │
│    ├─ detect_crisis()       │ → Regex pattern match
│    ├─ is_short_ack()        │ → Quick response
│    ├─ FAISS retriever       │ → Top-5 docs
│    └─ Gemini LLM            │ → Generate answer
│                             │
│ 3. store()                  │ → Save to Firestore
│    (user + assistant msgs)  │
└─────────────────────────────┘
    ↓
Response: {answer, crisis, num_docs}
    ↓
Frontend: Append to chat UI
```

### Analytics Query Flow

```
User selects date range (Frontend)
    ↓
GET /api/analytics/trends?user_uid=X&date_range=7d
    ↓
analytics_routes.get_trends()
    ↓
Firestore Query:
  - Filter: user_uid == X
  - Filter: created_at >= start_utc
  - Filter: created_at <= end_utc
    ↓
In-Memory Processing:
  - Group by date (IST timezone)
  - Compute daily averages
  - Calculate sentiment distribution
  - Fill gaps for missing dates
    ↓
Response: {range, series[], tz}
    ↓
Frontend: Render charts (Recharts)
```

## Deployment

### Prerequisites

1. **Python 3.8+** with virtual environment
2. **Node.js 18+** and npm
3. **Firebase Project** with Firestore enabled
4. **Firebase Service Account** JSON key (`firebase_secret.json`)
5. **Google Gemini API Key** (set in `.env`)
6. **Trained RoBERTa Model Weights** (`backend/model_weights/best_roberta_large_cueing_final.bin`)

### Backend Deployment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
# Create .env file with:
# GEMINI_API_KEY=your_gemini_api_key

# Place firebase_secret.json in backend/ directory

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production (with Gunicorn)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Deployment

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables

**Backend (.env):**
```
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend:**
- Firebase configuration in `src/services/firebase.js`
- API base URL: Configure in API client (default: `http://localhost:8000`)

### Production Considerations

1. **CORS Configuration**: Update `allow_origins` in `main.py` to production frontend URL
2. **Model Loading**: RoBERTa model loads on startup (~2GB RAM). Consider lazy loading or model serving
3. **Firestore Indexes**: Create composite indexes for analytics queries (user_uid + created_at)
4. **Vector Store**: FAISS index must be present at `backend/vectorstore/db_faiss/`
5. **Error Handling**: Implement rate limiting and request validation
6. **Monitoring**: Add logging (e.g., Python `logging` module) for production debugging
7. **Security**: Store API keys in environment variables, never commit `firebase_secret.json`

### Docker Deployment (Optional)

```dockerfile
# Backend Dockerfile example
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloud Deployment Options

- **Backend**: AWS Elastic Beanstalk, Google Cloud Run, Heroku, Railway
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: Firebase Firestore (managed service)
- **Vector Store**: Include FAISS index in deployment package or use managed vector DB (Pinecone, Weaviate)

---

## License

[Specify license if applicable]

## Contributors

[Add contributor information]
