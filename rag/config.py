import os
from dotenv import load_dotenv

# Load local .env if it exists (for local development)
if os.path.exists(".env"):
    load_dotenv()

chroma_api_key = os.getenv("CHROMA_API_KEY")
chroma_tenant = os.getenv("CHROMA_TENANT")
chroma_database = os.getenv("CHROMA_DATABASE")