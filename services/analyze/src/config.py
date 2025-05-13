import os

CACHED_MODEL_PATH = "cache"
CACHED_MODEL_FULL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), CACHED_MODEL_PATH
)
