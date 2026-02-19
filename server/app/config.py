import os
from dotenv import load_dotenv

load_dotenv()

imagekit_private_key = os.getenv('IMAGEKIT_PRIVATE_KEY')
imagekit_public_key = os.getenv('IMAGEKIT_PUBLIC_KEY')
imagekit_url_endpoint = os.getenv('IMAGEKIT_URL_ENDPOINT')

print("Loaded ImageKit config:")
print(f"Private Key: {imagekit_private_key}")
print(f"Public Key: {imagekit_public_key}")
print(f"URL Endpoint: {imagekit_url_endpoint}")