import os
import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

load_dotenv()

#Firebase
cred = credentials.Certificate("firebase_secret.json")
firebase_admin.initialize_app(cred)
firestoreDB = firestore.client()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")