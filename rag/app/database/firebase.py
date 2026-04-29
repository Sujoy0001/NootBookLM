import os
import firebase_admin
from firebase_admin import credentials, firestore, db

def _init_firebase():
    if not firebase_admin._apps:
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        private_key = os.getenv("FIREBASE_PRIVATE_KEY")
        client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
        database_url = os.getenv("FIREBASE_DATABASE_URL")

        options = {}
        if database_url:
            options['databaseURL'] = database_url

        if project_id and private_key and client_email:
            private_key = private_key.replace('\\n', '\n')
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": project_id,
                "private_key": private_key,
                "client_email": client_email,
                "token_uri": "https://oauth2.googleapis.com/token"
            })
            firebase_admin.initialize_app(cred, options)
        else:
            firebase_admin.initialize_app(options=options if options else None)

def get_firestore_client():
    _init_firebase()
    return firestore.client()

def get_rtdb_client():
    _init_firebase()
    return db
