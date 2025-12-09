from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
from pydantic import field_validator


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/google_auth_db"
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:3000/auth/google/callback"
    
    # JWT
    # WARNING: This default SECRET_KEY is for development only!
    # Generate a secure key with: openssl rand -hex 32
    # Set it in your .env file before deploying to production
    SECRET_KEY: str = "your-secret-key-change-this-in-production-INSECURE"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - can be a list or comma-separated string
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:3000", "http://localhost:5173"]
    
    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS_ORIGINS from string or list"""
        if isinstance(v, str):
            # Split by comma and strip whitespace
            return [origin.strip() for origin in v.split(',')]
        return v
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()

# Validate critical settings in production
import os
if os.getenv("ENVIRONMENT", "development") == "production":
    if settings.SECRET_KEY == "your-secret-key-change-this-in-production-INSECURE":
        raise ValueError(
            "SECRET_KEY must be changed in production! "
            "Generate a secure key with: openssl rand -hex 32"
        )
