from imagekitio import ImageKit
from config import imagekit_private_key, imagekit_public_key, imagekit_url_endpoint

imagekit = ImageKit(
    private_key=imagekit_private_key
)

print("Initialized ImageKit client with the following configuration:")
print(f"Public Key: {imagekit_public_key}")
print(f"Private Key: {imagekit_private_key}")
print(f"URL Endpoint: {imagekit_url_endpoint}")
