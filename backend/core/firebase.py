import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase with credentials
cred = credentials.Certificate("firebase_secret.json")
firebase_admin.initialize_app(cred)

# Firestore client instance
db = firestore.client()
