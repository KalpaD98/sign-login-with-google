# Architecture Documentation

## System Overview

This application implements a modern full-stack architecture with Google OAuth authentication.

```
┌─────────────────────────────────────────────────────────────────┐
│                          User Browser                            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTPS
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                    Frontend (React 19 + Vite)                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Components                                                 │ │
│  │  - Login.jsx (Google Sign-In Button)                       │ │
│  │  - UserProfile.jsx (Profile Display)                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Services                                                   │ │
│  │  - authService.js (API calls)                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Libraries                                                  │ │
│  │  - @react-oauth/google (OAuth integration)                 │ │
│  │  - Ant Design 6.0.1 (UI components)                        │ │
│  │  - Axios (HTTP client)                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ REST API (JSON)
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                     Backend (FastAPI)                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Routes                                                     │ │
│  │  - POST /auth/google (Google OAuth verification)           │ │
│  │  - GET /auth/me (Get current user)                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Core                                                       │ │
│  │  - config.py (Settings)                                    │ │
│  │  - database.py (DB connection)                             │ │
│  │  - security.py (JWT handling)                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Models                                                     │ │
│  │  - user.py (SQLAlchemy User model)                         │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ SQL
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                   Database (PostgreSQL 16)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Tables                                                     │ │
│  │  - users (id, email, first_name, last_name,                │ │
│  │           profile_picture, google_id, timestamps)          │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

External Service:
┌──────────────────────────────────────────────────────────────────┐
│               Google OAuth 2.0 Service                           │
│  - Token verification                                            │
│  - User info retrieval                                           │
└──────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User clicks "Sign in with Google"
   │
   ├─> Frontend: @react-oauth/google opens Google OAuth popup
   │
2. User authenticates with Google
   │
   ├─> Google: User selects account and grants permissions
   │
3. Google returns credential token
   │
   ├─> Frontend: Receives credential token from Google
   │
4. Frontend sends token to backend
   │
   ├─> POST /auth/google { "token": "google-credential" }
   │
5. Backend verifies token with Google
   │
   ├─> Backend calls Google token verification API
   │
6. Google confirms token validity and returns user info
   │
   ├─> Google: Returns email, name, picture, google_id
   │
7. Backend creates/updates user in database
   │
   ├─> Database: INSERT or UPDATE user record
   │
8. Backend generates JWT token
   │
   ├─> Backend: Creates JWT with user_id and email
   │
9. Backend returns JWT + user data
   │
   ├─> Response: { "access_token": "jwt", "user": {...} }
   │
10. Frontend stores JWT and user data
    │
    ├─> localStorage: Saves token and user info
    │
11. Frontend displays user profile
    │
    └─> UI: Shows UserProfile component
```

## Data Flow

### User Sign-In
```
Browser → Frontend (Login.jsx)
        → Google OAuth Popup
        → Google returns credential
        → Frontend (authService.authenticateWithGoogle)
        → Backend POST /auth/google
        → Backend verifies with Google API
        → Backend queries/creates user in PostgreSQL
        → Backend generates JWT
        → Backend returns JWT + user data
        → Frontend stores in localStorage
        → Frontend updates UI (UserProfile.jsx)
```

### Authenticated Requests
```
Browser → Frontend (any authenticated request)
        → Axios interceptor adds Authorization header
        → Backend receives request with Bearer token
        → Backend verifies JWT
        → Backend processes request
        → Backend returns response
        → Frontend updates UI
```

## Technology Stack Details

### Frontend
- **React 19.0.0**: Latest React with modern features
- **Vite 7.2.4**: Next-generation frontend tooling
- **Ant Design 6.0.1**: Enterprise-level UI components
- **@react-oauth/google 0.12.2**: Official Google OAuth for React
- **Axios 1.13.2**: Promise-based HTTP client

### Backend
- **FastAPI 0.115.0**: Modern, fast web framework
- **Uvicorn 0.32.0**: ASGI server
- **SQLAlchemy 2.0.36**: SQL toolkit and ORM
- **Pydantic 2.10.1**: Data validation
- **Google Auth 2.36.0**: Google authentication library
- **Python-JOSE 3.3.0**: JWT implementation

### Database
- **PostgreSQL 16**: Advanced open-source relational database
- **psycopg2-binary 2.9.10**: PostgreSQL adapter

### Infrastructure
- **Docker Compose**: Container orchestration for PostgreSQL
- **CORS**: Configured for local development

## Security Measures

### Authentication
- Google OAuth 2.0 for secure user authentication
- JWT tokens for stateless authentication
- Token verification on every protected endpoint
- Authorization header for token transmission (not query params)

### Data Protection
- Passwords not stored (OAuth only)
- JWT tokens have expiration time (30 minutes default)
- CORS configured to allow only specific origins
- Environment variables for sensitive configuration

### Database
- Connection pooling via SQLAlchemy
- Prepared statements to prevent SQL injection
- Unique constraints on email and google_id

## API Endpoints

### Authentication Endpoints

#### POST /auth/google
Authenticate user with Google OAuth token

**Request:**
```json
{
  "token": "google-oauth-credential-token"
}
```

**Response:**
```json
{
  "access_token": "jwt-token",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture": "https://...",
    "google_id": "12345",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /auth/me
Get current authenticated user

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "profile_picture": "https://...",
  "google_id": "12345",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_picture VARCHAR,
    google_id VARCHAR UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
```

## Scalability Considerations

### Current Architecture
- Single server deployment
- Direct database connections
- In-memory JWT validation

### Future Enhancements
1. **Caching**: Add Redis for session management and token blacklisting
2. **Load Balancing**: Multiple backend instances behind load balancer
3. **Database**: Read replicas for scaling reads
4. **CDN**: Serve static frontend assets via CDN
5. **Queue**: Background jobs for email notifications
6. **Monitoring**: Application performance monitoring (APM)
7. **Logging**: Centralized logging system

## Development vs Production

### Development
- SQLite or local PostgreSQL
- DEBUG mode enabled
- CORS allows all origins
- Detailed error messages
- No HTTPS required

### Production Recommendations
1. Use managed PostgreSQL (AWS RDS, Google Cloud SQL)
2. Enable HTTPS only
3. Restrict CORS to specific domains
4. Use environment-specific secrets
5. Enable rate limiting
6. Implement proper logging
7. Set up monitoring and alerts
8. Use production WSGI server (Gunicorn + Uvicorn workers)
9. Implement database backups
10. Use secrets manager for credentials

## Monitoring and Logging

### Recommended Metrics
- Request latency (p50, p95, p99)
- Error rate
- Active users
- Database connection pool usage
- Authentication success/failure rate

### Logging Strategy
- Application logs: INFO level in production
- Access logs: All API requests
- Error logs: All exceptions with stack traces
- Audit logs: User authentication events

## Deployment Options

### Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Cloud Platforms
- **AWS**: Elastic Beanstalk, ECS, or Lambda
- **Google Cloud**: App Engine, Cloud Run, or GKE
- **Heroku**: Direct deployment from git
- **DigitalOcean**: App Platform or Droplets

### CI/CD
- GitHub Actions for automated testing and deployment
- Pre-commit hooks for code quality
- Automated security scanning
