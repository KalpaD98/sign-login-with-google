"""
Test cases for security utilities (JWT tokens).
"""

import pytest
from datetime import datetime, timedelta, timezone
from app.core.security import create_access_token, verify_token
from jose import jwt
from app.core.config import settings


def test_create_access_token():
    """Test creating an access token."""
    data = {"sub": "123", "email": "test@example.com"}
    token = create_access_token(data=data)
    
    assert token is not None
    assert isinstance(token, str)
    
    # Decode and verify the token
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == "123"
    assert payload["email"] == "test@example.com"
    assert "exp" in payload


def test_verify_valid_token():
    """Test verifying a valid token."""
    data = {"sub": "456", "email": "verify@example.com"}
    token = create_access_token(data=data)
    
    payload = verify_token(token)
    
    assert payload is not None
    assert payload["sub"] == "456"
    assert payload["email"] == "verify@example.com"


def test_verify_invalid_token():
    """Test verifying an invalid token."""
    invalid_token = "invalid.token.here"
    
    payload = verify_token(invalid_token)
    
    assert payload is None


def test_verify_expired_token():
    """Test verifying an expired token."""
    # Create a token that's already expired
    data = {"sub": "789", "email": "expired@example.com"}
    expire = datetime.now(timezone.utc) - timedelta(minutes=1)  # Expired 1 minute ago
    data.update({"exp": expire})
    
    expired_token = jwt.encode(data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    payload = verify_token(expired_token)
    
    assert payload is None


def test_token_contains_expiration():
    """Test that created tokens contain expiration time."""
    data = {"sub": "999"}
    token = create_access_token(data=data)
    
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    
    assert "exp" in payload
    exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    now = datetime.now(timezone.utc)
    
    # Expiration should be in the future
    assert exp_time > now
    
    # Expiration should be approximately ACCESS_TOKEN_EXPIRE_MINUTES from now
    expected_exp = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    time_diff = abs((exp_time - expected_exp).total_seconds())
    
    # Allow 5 seconds tolerance
    assert time_diff < 5


def test_verify_token_with_wrong_secret():
    """Test that tokens signed with wrong secret are rejected."""
    data = {"sub": "111"}
    wrong_secret = "wrong_secret_key"
    
    # Create token with wrong secret
    wrong_token = jwt.encode(data, wrong_secret, algorithm=settings.ALGORITHM)
    
    # Try to verify with correct secret
    payload = verify_token(wrong_token)
    
    assert payload is None


def test_token_preserves_custom_data():
    """Test that custom data in token is preserved."""
    data = {
        "sub": "222",
        "email": "custom@example.com",
        "custom_field": "custom_value",
        "role": "admin"
    }
    
    token = create_access_token(data=data)
    payload = verify_token(token)
    
    assert payload is not None
    assert payload["sub"] == "222"
    assert payload["email"] == "custom@example.com"
    assert payload["custom_field"] == "custom_value"
    assert payload["role"] == "admin"
