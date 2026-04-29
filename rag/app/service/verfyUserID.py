from fastapi import HTTPException
from ..database.firebase import get_firestore_client

def verify_api_key(x_api_key: str) -> str:
    """
    Verifies the provided API key against the Firestore database.
    Returns the user_id if valid, otherwise raises an HTTPException.
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API Key is missing")

    if len(x_api_key) <= 11:
        raise HTTPException(status_code=401, detail="Invalid API Key format")

    # The first 11 characters (10 random chars + hyphen) are prefix, and the remaining part is the user_id
    user_id = x_api_key[11:]

    try:
        db = get_firestore_client()
        # Find the user document in the 'users' collection (acting as the user table)
        user_doc_ref = db.collection("users").document(user_id)
        user_doc = user_doc_ref.get()

        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        
        api_keys = user_data.get("apiKeys", [])
        
        # Check if the API key exists in the apiKeys array
        is_valid_key = False
        for key_obj in api_keys:
            if key_obj.get("value") == x_api_key:
                is_valid_key = True
                break
                
        if not is_valid_key:
            raise HTTPException(status_code=403, detail="Invalid API Key")

        return user_id

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")
