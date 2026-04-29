from slowapi import Limiter
from fastapi import Request, HTTPException
from app.service.verfyUserID import verify_api_key

def get_api_key_identifier(request: Request):
    api_key = request.headers.get("x-api-key")
    
    if not api_key:
        raise HTTPException(status_code=401, detail="API Key is missing")

    # Use the verification service to ensure the API key is valid before applying rate limits
    verify_api_key(api_key)
    
    # Rate limit purely by the API key (since the same user can have multiple keys for different sites)
    return api_key

# Use our custom key function to rate limit by API key
limiter = Limiter(key_func=get_api_key_identifier)
