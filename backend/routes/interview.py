"""
Interview routes
----------------
POST /interview/generate-questions  – generate AI interview questions
POST /interview/submit-answer       – submit an answer for evaluation
POST /interview/end                 – end session and trigger report generation

The AI question generation and answer evaluation are designed to call an LLM
(e.g. OpenAI GPT or a locally hosted model). Replace the placeholder logic
with real LLM calls once the model integration is ready.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter(prefix="/interview", tags=["interview"])
security = HTTPBearer(auto_error=False)


# ── Pydantic schemas ───────────────────────────────────────────────────────────

class GenerateQuestionsRequest(BaseModel):
    jobRole: str
    skills: list[str]
    difficulty: str  # "easy" | "intermediate" | "hard"


class Question(BaseModel):
    id: str
    text: str


class GenerateQuestionsResponse(BaseModel):
    sessionId: str
    questions: list[Question]


class EmotionEntry(BaseModel):
    emotion: str
    confidence: float
    timestamp: float


class EmotionData(BaseModel):
    dominantEmotion: str
    averageConfidence: float
    emotionLog: list[EmotionEntry] = []


class SubmitAnswerRequest(BaseModel):
    sessionId: str
    questionId: str
    questionText: str
    answerText: str
    emotionData: Optional[EmotionData] = None


class Evaluation(BaseModel):
    score: int  # 0-100
    feedback: str


class SubmitAnswerResponse(BaseModel):
    evaluation: Evaluation
    nextQuestion: Optional[Question] = None


class EmotionSummary(BaseModel):
    dominantEmotion: str
    averageConfidence: float


class EndInterviewRequest(BaseModel):
    sessionId: str
    durationSeconds: int
    emotionSummary: Optional[EmotionSummary] = None


class EndInterviewResponse(BaseModel):
    reportId: str


# ── Route handlers ─────────────────────────────────────────────────────────────

@router.post("/generate-questions", response_model=GenerateQuestionsResponse)
async def generate_questions(
    body: GenerateQuestionsRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Generate tailored interview questions using an LLM.
    TODO: integrate with OpenAI / local LLM to generate real questions.
    """
    if not body.jobRole or not body.skills:
        raise HTTPException(status_code=400, detail="jobRole and skills are required")

    session_id = str(uuid.uuid4())

    # Placeholder questions – replace with LLM call
    placeholder_questions = [
        Question(id=str(uuid.uuid4()), text=f"Tell me about your experience with {body.skills[0]}."),
        Question(id=str(uuid.uuid4()), text=f"What interests you most about the {body.jobRole} role?"),
        Question(id=str(uuid.uuid4()), text="Describe a challenging project you worked on and how you handled it."),
        Question(id=str(uuid.uuid4()), text="How do you stay up to date with new technologies in your field?"),
        Question(id=str(uuid.uuid4()), text="Where do you see yourself in the next 3-5 years?"),
    ]

    return GenerateQuestionsResponse(sessionId=session_id, questions=placeholder_questions)


@router.post("/submit-answer", response_model=SubmitAnswerResponse)
async def submit_answer(
    body: SubmitAnswerRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Evaluate a candidate's answer using an LLM and return feedback + next question.
    TODO: integrate LLM to score and give detailed feedback on the answer.
    """
    if not body.sessionId or not body.answerText:
        raise HTTPException(status_code=400, detail="sessionId and answerText are required")

    # Placeholder evaluation – replace with LLM call
    evaluation = Evaluation(
        score=75,
        feedback="Good answer. You covered the key points clearly. Consider adding more specific examples next time.",
    )

    return SubmitAnswerResponse(evaluation=evaluation, nextQuestion=None)


@router.post("/end", response_model=EndInterviewResponse)
async def end_interview(
    body: EndInterviewRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Finalise the interview session and trigger async report generation.
    TODO: persist session data to DB, trigger report generation pipeline.
    """
    if not body.sessionId:
        raise HTTPException(status_code=400, detail="sessionId is required")

    report_id = str(uuid.uuid4())
    return EndInterviewResponse(reportId=report_id)
