from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("MONGO_URL is not set in .env file")

print(f"Connecting to: {MONGO_URL}")  

client = AsyncIOMotorClient(MONGO_URL)
database = client["NootBookLM"]
docs_collection = database["docs"]