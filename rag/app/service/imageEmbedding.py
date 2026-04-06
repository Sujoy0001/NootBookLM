import google.generativeai as genai
import os

class ImageEmbeddingService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_IMG_EMB_API_KEY")
        genai.configure(api_key=self.api_key)

    def get_image_embedding(self, image_url):
        try:
            response = genai.ImageEmbedding.create(
                model="gemini-1.5-pro",
                input=image_url
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error getting image embedding: {e}")
            return None