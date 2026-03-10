"""
Authentication routes
---------------------
POST /auth/signup  – register a new user
POST /auth/signin  – login and receive a JWT token
GET  /auth/me      – return the currently authenticated user

These are stubs ready to be wired up to a real database / auth library
(e.g. SQLAlchemy + passlib + python-jose).
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


# ── Pydantic schemas ───────────────────────────────────────────────────────────

class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


# ── Route handlers ─────────────────────────────────────────────────────────────

@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(body: SignUpRequest):
    """
    Register a new user and return a JWT token.
    TODO: hash password, persist to DB, generate real JWT.
    """
    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    # Placeholder – replace with real DB insertion
    user = UserResponse(id="user_placeholder_id", name=body.name, email=body.email)
    token = "placeholder_jwt_token"
    return AuthResponse(token=token, user=user)


@router.post("/signin", response_model=AuthResponse)
async def signin(body: SignInRequest):
    """
    Validate credentials and return a JWT token.
    TODO: look up user in DB, verify hashed password, generate real JWT.
    """
    # Placeholder – replace with real DB lookup + password check
    user = UserResponse(id="user_placeholder_id", name="Demo User", email=body.email)
    token = "placeholder_jwt_token"
    return AuthResponse(token=token, user=user)


@router.get("/me", response_model=UserResponse)
async def me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Return the profile of the currently authenticated user.
    TODO: decode JWT, look up user in DB.
    """
    # Placeholder – replace with real JWT decode + DB lookup
    _ = credentials.credentials  # JWT token
    return UserResponse(id="user_placeholder_id", name="Demo User", email="demo@example.com")
