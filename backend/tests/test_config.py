"""
Test cases for configuration and settings.
"""

import pytest
import os
from app.core.config import Settings


def test_default_settings():
    """Test that default settings are loaded correctly."""
    settings = Settings()
    
    assert settings.DATABASE_URL == "postgresql://postgres:postgres@localhost:5432/google_auth_db"
    assert settings.ALGORITHM == "HS256"
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30


def test_cors_origins_as_list():
    """Test CORS origins when provided as a list."""
    settings = Settings(CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"])
    
    assert isinstance(settings.CORS_ORIGINS, list)
    assert len(settings.CORS_ORIGINS) == 2
    assert "http://localhost:3000" in settings.CORS_ORIGINS


def test_cors_origins_as_string():
    """Test CORS origins when provided as comma-separated string."""
    settings = Settings(CORS_ORIGINS="http://localhost:3000,http://localhost:5173,http://example.com")
    
    assert isinstance(settings.CORS_ORIGINS, list)
    assert len(settings.CORS_ORIGINS) == 3
    assert "http://localhost:3000" in settings.CORS_ORIGINS
    assert "http://localhost:5173" in settings.CORS_ORIGINS
    assert "http://example.com" in settings.CORS_ORIGINS


def test_cors_origins_string_with_spaces():
    """Test CORS origins string parsing handles spaces correctly."""
    settings = Settings(CORS_ORIGINS="http://localhost:3000, http://localhost:5173 , http://example.com")
    
    assert isinstance(settings.CORS_ORIGINS, list)
    assert len(settings.CORS_ORIGINS) == 3
    # Spaces should be stripped
    assert "http://localhost:3000" in settings.CORS_ORIGINS
    assert "http://localhost:5173" in settings.CORS_ORIGINS
    assert "http://example.com" in settings.CORS_ORIGINS


def test_secret_key_validation_in_production():
    """Test that insecure secret key raises error in production."""
    # Set environment to production
    os.environ["ENVIRONMENT"] = "production"
    
    with pytest.raises(ValueError, match="SECRET_KEY must be changed in production"):
        # Import will trigger the validation
        from importlib import reload
        import app.core.config as config_module
        reload(config_module)
    
    # Clean up
    os.environ.pop("ENVIRONMENT", None)


def test_custom_database_url():
    """Test that custom database URL can be set."""
    custom_url = "postgresql://user:pass@customhost:5432/customdb"
    settings = Settings(DATABASE_URL=custom_url)
    
    assert settings.DATABASE_URL == custom_url


def test_custom_token_expiration():
    """Test that custom token expiration can be set."""
    settings = Settings(ACCESS_TOKEN_EXPIRE_MINUTES=60)
    
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 60


def test_google_oauth_settings():
    """Test Google OAuth settings."""
    settings = Settings(
        GOOGLE_CLIENT_ID="test_client_id",
        GOOGLE_CLIENT_SECRET="test_client_secret"
    )
    
    assert settings.GOOGLE_CLIENT_ID == "test_client_id"
    assert settings.GOOGLE_CLIENT_SECRET == "test_client_secret"
    assert settings.GOOGLE_REDIRECT_URI == "http://localhost:3000/auth/google/callback"
