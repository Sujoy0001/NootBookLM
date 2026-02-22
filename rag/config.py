import os
from dotenv import load_dotenv

load_dotenv()

chroma_api_key = os.getenv("CHROMA_API_KEY")
chroma_tenant = os.getenv("CHROMA_TENANT")
chroma_database = os.getenv("CHROMA_DATABASE")

print(f"the api is : {chroma_api_key}")