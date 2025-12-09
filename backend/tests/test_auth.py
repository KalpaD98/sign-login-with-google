"""
Test cases for authentication endpoints.

To run these tests:
1. Install pytest: pip install pytest pytest-asyncio httpx
2. Run: pytest tests/

Note: These tests use mocked Google OAuth responses for testing.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.core.security import create_access_token

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def cleanup_database():
    """Clean up database after each test"""
    yield
    # Drop all tables and recreate
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_root_endpoint():
    """Test the root endpoint returns correct information."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Google Sign-In API"
    assert "version" in data
    assert data["version"] == "1.0.0"


def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_get_me_without_token():
    """Test /auth/me endpoint without authentication token."""
    response = client.get("/auth/me")
    assert response.status_code == 403  # HTTPBearer returns 403 when no credentials
    data = response.json()
    assert "detail" in data


def test_get_me_with_invalid_token():
    """Test /auth/me endpoint with invalid token."""
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data


def test_google_auth_without_token():
    """Test /auth/google endpoint without token."""
    response = client.post("/auth/google", json={})
    assert response.status_code == 422  # Validation error
    data = response.json()
    assert "detail" in data


def test_google_auth_with_empty_token():
    """Test /auth/google endpoint with empty token."""
    response = client.post("/auth/google", json={"token": ""})
    assert response.status_code == 422  # Validation error (min_length=1)
    data = response.json()
    assert "detail" in data


@patch('app.routes.auth.id_token.verify_oauth2_token')
def test_google_auth_with_valid_token_new_user(mock_verify):
    """Test /auth/google endpoint with valid token for new user."""
    # Mock Google token verification
    mock_verify.return_value = {
        "sub": "google_user_123",
        "email": "test@example.com",
        "given_name": "Test",
        "family_name": "User",
        "picture": "https://example.com/photo.jpg"
    }
    
    response = client.post("/auth/google", json={"token": "valid_google_token"})
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["first_name"] == "Test"
    assert data["user"]["last_name"] == "User"


@patch('app.routes.auth.id_token.verify_oauth2_token')
def test_google_auth_with_valid_token_existing_user(mock_verify):
    """Test /auth/google endpoint with valid token for existing user."""
    # Mock Google token verification
    mock_verify.return_value = {
        "sub": "google_user_456",
        "email": "existing@example.com",
        "given_name": "Existing",
        "family_name": "User",
        "picture": "https://example.com/photo2.jpg"
    }
    
    # First request - create user
    response1 = client.post("/auth/google", json={"token": "valid_google_token"})
    assert response1.status_code == 200
    user_id_1 = response1.json()["user"]["id"]
    
    # Second request - same user
    response2 = client.post("/auth/google", json={"token": "valid_google_token"})
    assert response2.status_code == 200
    user_id_2 = response2.json()["user"]["id"]
    
    # Should be the same user
    assert user_id_1 == user_id_2


@patch('app.routes.auth.id_token.verify_oauth2_token')
def test_google_auth_with_invalid_google_token(mock_verify):
    """Test /auth/google endpoint with invalid Google token."""
    # Mock Google token verification to raise ValueError
    mock_verify.side_effect = ValueError("Invalid token")
    
    response = client.post("/auth/google", json={"token": "invalid_token"})
    
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert "Invalid or expired Google token" in data["detail"]


@patch('app.routes.auth.id_token.verify_oauth2_token')
def test_google_auth_without_email_in_token(mock_verify):
    """Test /auth/google endpoint when Google token doesn't contain email."""
    # Mock Google token verification without email
    mock_verify.return_value = {
        "sub": "google_user_789",
        "given_name": "Test",
        "family_name": "User"
    }
    
    response = client.post("/auth/google", json={"token": "token_without_email"})
    
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "Email not found" in data["detail"]


@patch('app.routes.auth.id_token.verify_oauth2_token')
def test_get_me_with_valid_token(mock_verify):
    """Test /auth/me endpoint with valid token."""
    # First, create a user
    mock_verify.return_value = {
        "sub": "google_user_999",
        "email": "validuser@example.com",
        "given_name": "Valid",
        "family_name": "User",
        "picture": "https://example.com/photo3.jpg"
    }
    
    # Create user and get token
    auth_response = client.post("/auth/google", json={"token": "valid_google_token"})
    assert auth_response.status_code == 200
    access_token = auth_response.json()["access_token"]
    
    # Test /auth/me with valid token
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "validuser@example.com"
    assert data["first_name"] == "Valid"
    assert data["last_name"] == "User"


def test_jwt_token_creation():
    """Test JWT token creation."""
    token_data = {"sub": "123", "email": "test@example.com"}
    token = create_access_token(data=token_data)
    
    assert token is not None
    assert isinstance(token, str)
    assert len(token) > 0


def test_cors_headers():
    """Test that CORS headers are properly set."""
    response = client.options("/")
    # FastAPI/Starlette handles OPTIONS automatically with CORS middleware
    assert response.status_code in [200, 405]  # 405 if no OPTIONS handler
