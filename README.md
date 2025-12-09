# Sign-in with Google - Full Stack Application

A modern, production-ready full-stack application featuring Google OAuth authentication with React 19, Ant Design 6.0.1, FastAPI, and PostgreSQL.

> **Quick Start**: See [QUICKSTART.md](docs/QUICKSTART.md) to get started in under 5 minutes!

## Core Features

- **Google OAuth Authentication**: Secure sign-in with Google
- **User Profile Management**: Store and display user details
- **Modern Frontend**: React 19 with Ant Design 6.0.1
- **Fast Backend**: FastAPI with comprehensive error handling
- **Database**: PostgreSQL with Alembic migrations
- **JWT Authentication**: Token-based auth with expiration handling
- **Production Ready**: Testing, logging, and security hardened

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose
- Google Cloud Console account (for OAuth credentials)

## Quick Start

> **First time?** Follow [QUICKSTART.md](docs/QUICKSTART.md) for detailed setup instructions.

### Fast Setup (5 minutes)

```bash
# 1. Clone and setup
git clone <repo-url>
cd sign-login-with-google
./setup.sh  # or manual setup on Windows

# 2. Configure environment files with Google OAuth credentials
# Edit: backend/.env and frontend/.env

# 3. Run migrations
cd backend
alembic upgrade head
cd ..

# 4. Start development
make docker-up
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Alternative Options

**Local Development:**
```bash
# Terminal 1: Backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend && npm run dev
```

## Setup Instructions

For detailed setup instructions, see [QUICKSTART.md](docs/QUICKSTART.md).

## API Endpoints

### Authentication

- `POST /auth/google` - Authenticate with Google OAuth token
  - Request: `{ "token": "google-oauth-token" }`
  - Response: `{ "access_token": "jwt-token", "token_type": "bearer", "user": {...} }`

- `GET /auth/me` - Get current user (requires Bearer token)
  - Response: User object with profile data

### General

- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation


## Technology Stack

### Frontend
- **React 19.0.0**: Latest React version with modern features
- **Ant Design 6.0.1**: Enterprise-level UI design language
- **@react-oauth/google**: Google OAuth integration
- **Axios**: HTTP client for API requests
- **Vite**: Fast build tool and dev server

### Backend
- **FastAPI**: Modern, fast web framework for Python
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Advanced open-source database
- **Google Auth Library**: Google authentication
- **Python-JOSE**: JWT token handling
- **Pydantic**: Data validation using Python type annotations

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/google_auth_db
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
SECRET_KEY=your-secret-key
```

### Frontend (.env)
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8000
```

## Development

For development commands and testing, see [QUICKSTART.md](docs/QUICKSTART.md) and [MAKEFILE.md](docs/MAKEFILE.md).

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## License

This project is licensed under the MIT License.

## Authors

- KalpaD98

## Documentation

- **[QUICKSTART.md](docs/QUICKSTART.md)** - Complete setup guide with troubleshooting
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Contribution guidelines

## Acknowledgments

- Google OAuth for authentication
- React team for React 19
- Ant Design team for the UI components
- FastAPI team for the excellent framework
