"""
Repository layer for User model database operations.
Handles all database queries and mutations for users.
"""
from sqlalchemy.orm import Session
from typing import Optional

from app.models.user import User


class UserRepository:
    """Repository for User model database operations."""

    def __init__(self, db: Session):
        """
        Initialize the repository with a database session.

        Args:
            db: SQLAlchemy database session
        """
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get a user by email address.

        Args:
            email: User's email address

        Returns:
            User if found, None otherwise
        """
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """
        Get a user by ID.

        Args:
            user_id: User's ID

        Returns:
            User if found, None otherwise
        """
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_google_id(self, google_id: str) -> Optional[User]:
        """
        Get a user by Google ID.

        Args:
            google_id: User's Google ID

        Returns:
            User if found, None otherwise
        """
        return self.db.query(User).filter(User.google_id == google_id).first()

    def create_user(
        self,
        email: str,
        google_id: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        profile_picture: Optional[str] = None,
    ) -> User:
        """
        Create a new user.

        Args:
            email: User's email address
            google_id: Google ID
            first_name: User's first name
            last_name: User's last name
            profile_picture: URL to user's profile picture

        Returns:
            Created User object
        """
        user = User(
            email=email,
            google_id=google_id,
            first_name=first_name,
            last_name=last_name,
            profile_picture=profile_picture,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_user(
        self,
        user: User,
        google_id: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        profile_picture: Optional[str] = None,
    ) -> User:
        """
        Update an existing user.

        Args:
            user: User object to update
            google_id: Google ID
            first_name: User's first name
            last_name: User's last name
            profile_picture: URL to user's profile picture

        Returns:
            Updated User object
        """
        if google_id is not None:
            user.google_id = google_id
        if first_name is not None:
            user.first_name = first_name
        if last_name is not None:
            user.last_name = last_name
        if profile_picture is not None:
            user.profile_picture = profile_picture

        self.db.commit()
        self.db.refresh(user)
        return user
