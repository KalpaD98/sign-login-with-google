from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture: Optional[str] = None


class UserCreate(UserBase):
    google_id: Optional[str] = None


class UserResponse(UserBase):
    id: int
    google_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class GoogleTokenRequest(BaseModel):
    """Request schema for Google OAuth token"""
    token: str = Field(..., min_length=1, description="Google OAuth ID token")


class GoogleAuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
