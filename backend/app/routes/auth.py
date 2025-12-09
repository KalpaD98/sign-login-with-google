from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import logging

from app.core.database import get_db
from app.core.config import settings
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import GoogleAuthResponse, GoogleTokenRequest, UserResponse

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/google", response_model=GoogleAuthResponse)
def google_auth(token_request: GoogleTokenRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with Google OAuth token
    
    Args:
        token_request: Google OAuth token request
        db: Database session
        
    Returns:
        GoogleAuthResponse: Access token and user information
    """
    try:
        # Verify the Google token
        idinfo = id_token.verify_oauth2_token(
            token_request.token, 
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
            logger.warning("Google token verification succeeded but no email found")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not found in Google token"
            )
        
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create new user
            logger.info(f"Creating new user with email: {email}")
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
            logger.info(f"Updating existing user: {email}")
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
        # Invalid token - log detailed error but return generic message
        logger.error(f"Google token verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google token"
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log unexpected errors but don't expose details to client
        logger.exception(f"Unexpected error during authentication: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed. Please try again later."
        )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    Args:
        current_user: Current authenticated user (injected by dependency)
        
    Returns:
        UserResponse: Current user information
    """
    return UserResponse.model_validate(current_user)
