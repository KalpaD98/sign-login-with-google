"""
Service layer for authentication business logic.
Orchestrates user repository and token creation.
"""
import logging
from typing import Dict, Any

from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.schemas.user import GoogleAuthResponse, UserResponse
from app.core.security import create_access_token

logger = logging.getLogger(__name__)


class AuthService:
    """Service for authentication operations."""

    def __init__(self, db: Session):
        """
        Initialize the service with a database session.

        Args:
            db: SQLAlchemy database session
        """
        self.user_repo = UserRepository(db)

    def get_or_create_user(
        self,
        email: str,
        google_id: str,
        first_name: str,
        last_name: str,
        profile_picture: str,
    ) -> User:
        """
        Get an existing user or create a new one.

        Args:
            email: User's email
            google_id: User's Google ID
            first_name: User's first name
            last_name: User's last name
            profile_picture: User's profile picture URL

        Returns:
            User object
        """
        user = self.user_repo.get_user_by_email(email)

        if not user:
            logger.info(f"Creating new user with email: {email}")
            user = self.user_repo.create_user(
                email=email,
                google_id=google_id,
                first_name=first_name,
                last_name=last_name,
                profile_picture=profile_picture,
            )
        else:
            logger.info(f"Updating existing user: {email}")
            user = self.user_repo.update_user(
                user=user,
                google_id=google_id,
                first_name=first_name,
                last_name=last_name,
                profile_picture=profile_picture,
            )

        return user

    def authenticate_user(self, user: User) -> GoogleAuthResponse:
        """
        Create an authentication response for a user.

        Args:
            user: User object to authenticate

        Returns:
            GoogleAuthResponse with access token and user data
        """
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )

        return GoogleAuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )

    def get_user_by_id(self, user_id: int) -> User:
        """
        Get a user by ID.

        Args:
            user_id: User ID

        Returns:
            User object
        """
        return self.user_repo.get_user_by_id(user_id)
