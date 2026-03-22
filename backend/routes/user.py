"""
User routes
-----------
GET /user/profile   – get authenticated user's profile + interview history
PUT /user/profile   – update user's profile details
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter(prefix="/user", tags=["user"])
security = HTTPBearer()


# ── Pydantic schemas ───────────────────────────────────────────────────────────

class InterviewHistoryEntry(BaseModel):
    reportId: str
    role: str
    date: str
    overallScore: int
    durationSeconds: int


class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    createdAt: str
    interviewHistory: list[InterviewHistoryEntry] = []


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    currentPassword: Optional[str] = None
    newPassword: Optional[str] = None


# ── Route handlers ─────────────────────────────────────────────────────────────

@router.get("/profile", response_model=UserProfile)
async def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Return the authenticated user's profile and interview history.
    TODO: decode JWT, fetch user + history from DB.
    """
    _ = credentials.credentials  # JWT token – decode to get user id

    # Placeholder – replace with real DB lookup
    return UserProfile(
        id="user_placeholder_id",
        name="Demo User",
        email="demo@example.com",
        createdAt="2026-01-01T00:00:00Z",
        interviewHistory=[
            InterviewHistoryEntry(
                reportId="report_001",
                role="Software Developer",
                date="2026-03-10",
                overallScore=77,
                durationSeconds=565,
            )
        ],
    )


@router.put("/profile", response_model=UserProfile)
async def update_profile(
    body: UpdateProfileRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Update the authenticated user's profile.
    TODO: decode JWT, validate currentPassword, persist changes to DB.
    """
    _ = credentials.credentials

    if body.newPassword and (not body.currentPassword):
        raise HTTPException(
            status_code=400, detail="currentPassword is required to set a new password"
        )

    if body.newPassword and len(body.newPassword) < 8:
        raise HTTPException(
            status_code=400, detail="New password must be at least 8 characters"
        )

    # Placeholder – replace with real DB update
    return UserProfile(
        id="user_placeholder_id",
        name=body.name or "Demo User",
        email=body.email or "demo@example.com",
        createdAt="2026-01-01T00:00:00Z",
        interviewHistory=[],
    )
