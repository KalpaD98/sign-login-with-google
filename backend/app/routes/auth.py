from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from typing import Dict, Optional

from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.user import GoogleAuthResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/google", response_model=GoogleAuthResponse)
async def google_auth(token_data: Dict[str, str], db: Session = Depends(get_db)):
    """
    Authenticate user with Google OAuth token
    """
    try:
        # Verify the token with Google
        token = token_data.get("token")
        if not token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token is required"
            )
        
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )
        
        # Extract user information
        google_id = idinfo.get("sub")
        email = idinfo.get("email")
        first_name = idinfo.get("given_name")
        last_name = idinfo.get("family_name")
        profile_picture = idinfo.get("picture")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not found in Google token"
            )
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user
            user = User(
                email=email,
                first_name=first_name,
                last_name=last_name,
                profile_picture=profile_picture,
                google_id=google_id
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            # Update existing user information
            user.first_name = first_name
            user.last_name = last_name
            user.profile_picture = profile_picture
            user.google_id = google_id
            db.commit()
            db.refresh(user)
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
        
        return GoogleAuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
        
    except ValueError as e:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Get current user information
    """
    from app.core.security import verify_token
    
    # Extract token from Authorization header
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required"
        )
    
    # Expected format: "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>"
        )
    
    token = parts[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.model_validate(user)
