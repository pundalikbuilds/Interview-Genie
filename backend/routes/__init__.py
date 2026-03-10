# backend/routes/__init__.py
# Register all FastAPI routers here

from .auth import router as auth_router
from .interview import router as interview_router
from .feedback import router as feedback_router
from .user import router as user_router

__all__ = ["auth_router", "interview_router", "feedback_router", "user_router"]
