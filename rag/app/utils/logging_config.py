import logging
import sys
import os

def setup_logging():
    # Set logging level from environment variable or default to INFO
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    
    # Configure structured logging for production observability
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        stream=sys.stdout
    )
    
    # Disable propagation for some noisy libraries if needed
    logging.getLogger("uvicorn.access").propagate = False

setup_logging()
logger = logging.getLogger("rag-server")
