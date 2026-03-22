"""
Feedback routes
---------------
GET /feedback/{report_id}  – retrieve the full feedback report for a session

The report includes skill-level scores, overall score, LLM-generated textual
feedback, and the emotion/confidence summary captured by the YOLO model during
the interview.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/feedback", tags=["feedback"])
security = HTTPBearer(auto_error=False)


# ── Pydantic schemas ───────────────────────────────────────────────────────────

class SkillReport(BaseModel):
    id: int
    name: str
    category: str   # "Technical Skill" | "Soft Skill"
    score: int      # 0-100
    feedback: str


class EmotionSummary(BaseModel):
    dominantEmotion: str
    averageConfidence: float


class FeedbackReport(BaseModel):
    reportId: str
    candidateName: str
    role: str
    date: str
    durationSeconds: int
    overallScore: int
    overallFeedback: str
    emotionSummary: Optional[EmotionSummary] = None
    skills: list[SkillReport]


# ── Route handlers ─────────────────────────────────────────────────────────────

@router.get("/{report_id}", response_model=FeedbackReport)
async def get_feedback_report(
    report_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Retrieve the full feedback report for a completed interview session.
    TODO: fetch real report from DB using report_id.
    """
    if not report_id:
        raise HTTPException(status_code=400, detail="report_id is required")

    # Placeholder – replace with real DB lookup
    return FeedbackReport(
        reportId=report_id,
        candidateName="Demo Candidate",
        role="Software Developer",
        date="2026-03-10",
        durationSeconds=565,
        overallScore=77,
        overallFeedback=(
            "Overall, the candidate demonstrated solid technical knowledge and "
            "clear communication. There is room to improve depth of explanation "
            "and to provide more concrete examples when discussing past experience."
        ),
        emotionSummary=EmotionSummary(dominantEmotion="neutral", averageConfidence=0.82),
        skills=[
            SkillReport(
                id=1,
                name="Technical Knowledge",
                category="Technical Skill",
                score=80,
                feedback="Good understanding of core concepts. Needs more depth in edge cases.",
            ),
            SkillReport(
                id=2,
                name="Communication",
                category="Soft Skill",
                score=75,
                feedback="Communicated ideas clearly. Could improve by asking clarifying questions.",
            ),
            SkillReport(
                id=3,
                name="Problem Solving",
                category="Technical Skill",
                score=78,
                feedback="Showed a structured approach to problem solving. Explained reasoning well.",
            ),
        ],
    )
