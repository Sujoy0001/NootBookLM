# apiselector.py

from itertools import cycle
from threading import Lock
from config import GEMINI_API_KEY1, GEMINI_API_KEY2, GEMINI_API_KEY3

class APISelector:
    """
    Round Robin API Key Selector for Gemini APIs.

    Features:
    - Cycles through all API keys one by one
    - Thread-safe for FastAPI async/multi-worker usage
    - Skips empty keys automatically
    """

    def __init__(self, api_keys: list[str]):
        
        self.api_keys = [key for key in api_keys if key]

        if not self.api_keys:
            raise ValueError("No valid API keys provided.")

        self._cycle = cycle(self.api_keys)
        self._lock = Lock()

    def get_key(self) -> str:

        with self._lock:
            return next(self._cycle)


GEMINI_API_KEY = [
    GEMINI_API_KEY1,
    GEMINI_API_KEY2,
    GEMINI_API_KEY3
]


api_selector = APISelector(GEMINI_API_KEY)


def get_gemini_api_key():
    
    return api_selector.get_key()