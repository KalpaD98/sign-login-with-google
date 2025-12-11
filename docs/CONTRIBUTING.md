# Contributing Guide

Thank you for considering contributing to this project! This guide will help you get started with contributing to the Sign-in with Google full-stack application.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help maintain a positive environment

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node.js version, Python version, Docker version)
   - Backend logs (if applicable)
   - Browser console errors (if frontend-related)

### Suggesting Enhancements

1. Check existing feature requests
2. Open a new issue with:
   - Clear use case
   - Expected behavior
   - Why this enhancement would be useful
   - Possible implementation approach
   - Impact on existing features

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes (see Testing section)
5. Run linters and fix any issues
6. Commit with clear messages (see Git Commit Messages section)
7. Push to your fork
8. Open a Pull Request with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots (for UI changes)
   - Testing notes

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

### Quick Setup

```bash
# Clone the repository
git clone <repo-url>
cd sign-login-with-google

# Run setup script (Linux/macOS) or follow manual setup
./setup.sh

# Or use Makefile
make setup

# Start development environment
make docker-dev-up
```

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose
- Google OAuth credentials (see [QUICKSTART.md](QUICKSTART.md) for setup)

## Coding Standards

### Backend (Python/FastAPI)

- Follow PEP 8 style guide
- Use type hints for all function parameters and return types
- Write comprehensive docstrings for functions and classes
- Keep functions focused and small (single responsibility)
- Use dependency injection with FastAPI's `Depends()`
- Handle errors gracefully with appropriate HTTP status codes
- Use Pydantic schemas for request/response validation
- Log important events using Python's `logging` module

**Example:**
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserResponse
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    Args:
        current_user: Current authenticated user (injected by dependency)
        
    Returns:
        UserResponse: Current user information
        
    Raises:
        HTTPException: If user is not authenticated
    """
    return UserResponse.model_validate(current_user)
```

### Frontend (React 19/JavaScript)

- Use functional components with React hooks
- Follow React 19 best practices
- Use PropTypes for component prop validation
- Use Ant Design components consistently
- Keep components small and focused (single responsibility)
- Use destructuring for props and state
- Handle async operations with try/catch
- Use meaningful variable and component names
- Extract reusable logic into custom hooks when appropriate

**Example:**
```javascript
import { GoogleLogin } from '@react-oauth/google';
import { Card, message } from 'antd';
import PropTypes from 'prop-types';
import { authenticateWithGoogle } from '../services/authService';

const Login = ({ onLoginSuccess, hasConfigError }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      message.loading({ content: 'Authenticating...', key: 'auth' });
      const data = await authenticateWithGoogle(credentialResponse.credential);
      message.success({ content: 'Login successful!', key: 'auth' });
      onLoginSuccess(data.user);
    } catch (error) {
      message.error({ 
        content: `Login failed: ${error.response?.data?.detail || error.message}`, 
        key: 'auth' 
      });
    }
  };

  return (
    <Card>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => message.error('Login failed. Please try again.')}
      />
    </Card>
  );
};

Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
  hasConfigError: PropTypes.bool,
};

export default Login;
```

### Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- First line: brief summary (50 chars or less)
- Followed by detailed description if needed
- Reference issues and pull requests

**Example:**
```
Add user profile caching

- Implement localStorage caching for user profiles
- Reduce API calls by storing profile data locally
- Add cache invalidation on logout

Fixes #123
```

## Testing

### Backend Testing

Write tests for:
- New API endpoints and routes
- Database models and operations
- Authentication and authorization logic
- Error handling and edge cases
- Utility functions and helpers

**Running Backend Tests:**

```bash
# Using Makefile (recommended)
make test-backend

# Or manually
cd backend
source venv/bin/activate  # or activate your virtual environment
pytest tests/ -v

# Run specific test file
pytest tests/test_auth.py -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html
```

**Test Structure:**
- Tests use `pytest` framework
- Tests use SQLite in-memory database for isolation
- Google OAuth is mocked using `unittest.mock`
- Each test should be independent and clean up after itself

**Example Test:**
```python
from fastapi.testclient import TestClient
from unittest.mock import patch

@patch('app.routes.auth.id_token.verify_oauth2_token')
def test_google_auth_with_valid_token(mock_verify):
    """Test Google authentication with valid token."""
    mock_verify.return_value = {
        "sub": "google_user_123",
        "email": "test@example.com",
        "given_name": "Test",
        "family_name": "User"
    }
    
    response = client.post("/auth/google", json={"token": "valid_token"})
    assert response.status_code == 200
    assert "access_token" in response.json()
```

### Frontend Testing

Currently, frontend tests are manual. When adding new components:
- Test component rendering
- Test user interactions
- Test error states
- Test loading states
- Verify API integration

**Manual Frontend Testing:**

```bash
# Start frontend dev server
make dev-frontend
# or
cd frontend && npm run dev
```

### Manual Testing Checklist

Before submitting a PR:
1.  Test all changed functionality
2.  Test error cases and edge cases
3.  Verify existing features still work (regression testing)
4.  Test Google OAuth flow end-to-end
5.  Test on different browsers (Chrome, Firefox, Safari)
6.  Test responsive design on mobile devices
7.  Verify environment variables are properly configured
8.  Test with Docker (if applicable)
9.  Check browser console for errors
10.  Verify API documentation updates (FastAPI auto-docs)

## Code Review Process

1. All PRs require at least one review before merging
2. Address all review comments promptly
3. Keep PR scope focused (one feature/fix per PR)
4. Update documentation if needed (README, API docs, etc.)
5. Ensure all tests pass (`make test-backend`)
6. Ensure linting passes (`make lint`)
7. Verify Docker builds successfully (if applicable)
8. Respond to feedback constructively

## Project Structure

### Backend
```
backend/
├── app/
│   ├── core/          # Core functionality
│   │   ├── config.py      # Application configuration
│   │   ├── database.py    # Database setup and session
│   │   ├── dependencies.py # FastAPI dependencies
│   │   └── security.py    # JWT and security utilities
│   ├── models/        # SQLAlchemy ORM models
│   │   └── user.py        # User model
│   ├── routes/        # API route handlers
│   │   └── auth.py        # Authentication routes
│   ├── schemas/       # Pydantic schemas for validation
│   │   └── user.py        # User schemas
│   └── main.py        # FastAPI application entry point
├── alembic/           # Database migrations
│   ├── versions/      # Migration files
│   └── env.py         # Alembic environment config
├── tests/             # Test files
│   ├── test_auth.py   # Authentication tests
│   ├── test_config.py # Configuration tests
│   └── test_security.py # Security tests
├── requirements.txt   # Python dependencies
└── Dockerfile         # Production Docker image
```

### Frontend
```
frontend/
├── src/
│   ├── components/    # React components
│   │   ├── Login.jsx      # Login component
│   │   ├── UserProfile.jsx # User profile component
│   │   └── ErrorBoundary.jsx # Error boundary
│   ├── services/      # API service layer
│   │   └── authService.js  # Authentication service
│   ├── config/        # Configuration
│   │   └── api.js         # API configuration
│   ├── assets/        # Static assets
│   ├── App.jsx        # Main app component
│   ├── App.css        # App styles
│   ├── main.jsx       # Entry point
│   └── index.css      # Global styles
├── public/            # Public assets
├── package.json       # Node dependencies
├── vite.config.js     # Vite configuration
└── Dockerfile         # Production Docker image
```

### Root
```
.
├── docker-compose.yml      # Production Docker Compose
├── docker-compose.dev.yml  # Development Docker Compose
├── Makefile                # Development commands
├── setup.sh                # Setup script
└── docs/                   # Documentation
    ├── CONTRIBUTING.md
    ├── QUICKSTART.md
    ├── DOCKER.md
    └── MAKEFILE.md
```

## Adding New Features

### Backend: New Endpoint

1. **Create Pydantic schemas** in `app/schemas/`
   - Request schema (e.g., `UserCreate`)
   - Response schema (e.g., `UserResponse`)

2. **Add route handler** in `app/routes/`
   - Use appropriate HTTP method decorator
   - Add comprehensive docstring (appears in `/docs`)
   - Handle errors appropriately
   - Use dependency injection for database and auth

3. **Register route** in `app/main.py`
   - Import router
   - Include router with `app.include_router()`

4. **Write tests** in `tests/`
   - Test success cases
   - Test error cases
   - Test authentication/authorization

5. **Update documentation**
   - Update README.md if API changes
   - FastAPI auto-generates docs at `/docs`

**Example:**
```python
# app/schemas/user.py
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None

# app/routes/users.py
@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user information."""
    # Implementation
```

### Frontend: New Component

1. **Create component** in `src/components/`
   - Use functional component with hooks
   - Add PropTypes validation
   - Handle loading and error states

2. **Add styling**
   - Use Ant Design components
   - Add custom styles if needed
   - Ensure responsive design

3. **Create service** (if API call needed) in `src/services/`
   - Use axios for HTTP requests
   - Handle errors appropriately

4. **Integrate component**
   - Import in parent component
   - Pass necessary props
   - Handle callbacks

5. **Test manually**
   - Test rendering
   - Test user interactions
   - Test error states

**Example:**
```javascript
// src/components/NewComponent.jsx
import { Card, Button } from 'antd';
import PropTypes from 'prop-types';

const NewComponent = ({ data, onAction }) => {
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
};

NewComponent.propTypes = {
  data: PropTypes.object.isRequired,
  onAction: PropTypes.func,
};
```

### Database: New Model

1. **Create SQLAlchemy model** in `app/models/`
   - Define table structure
   - Add relationships if needed
   - Add indexes for performance

2. **Create Alembic migration**
   ```bash
   cd backend
   source venv/bin/activate
   alembic revision --autogenerate -m "add new model"
   ```

3. **Review migration** in `alembic/versions/`
   - Verify generated SQL
   - Add any manual adjustments if needed

4. **Run migration**
   ```bash
   alembic upgrade head
   ```

5. **Create Pydantic schemas** in `app/schemas/`
   - Base schema
   - Create schema
   - Response schema

6. **Add CRUD operations** in routes
   - Create, Read, Update, Delete endpoints

7. **Write tests** in `tests/`
   - Test model creation
   - Test relationships
   - Test constraints

**Example:**
```python
# app/models/post.py
class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="posts")
```

### Database Migrations

**Creating a Migration:**
```bash
cd backend
source venv/bin/activate
alembic revision --autogenerate -m "description of changes"
alembic upgrade head
```

**Reverting a Migration:**
```bash
alembic downgrade -1  # Go back one migration
alembic downgrade base  # Go back to beginning
```

**Important:**
- Always review auto-generated migrations
- Test migrations on a copy of production data
- Never edit existing migrations that have been applied
- Create new migrations for changes to existing migrations

## Documentation

Update documentation when:
- Adding new features or endpoints
- Changing API endpoints or request/response formats
- Modifying configuration or environment variables
- Updating dependencies
- Changing setup or deployment process
- Adding new Makefile commands

**Files to update:**
- `README.md` - Main project documentation
- `docs/QUICKSTART.md` - Quick start guide
- `docs/DOCKER.md` - Docker deployment guide (if Docker changes)
- `docs/MAKEFILE.md` - Makefile documentation (if commands added)
- `docs/CONTRIBUTING.md` - This file (if contributing process changes)
- API docstrings in code (appear in FastAPI `/docs`)
- Code comments for complex logic

**Documentation Standards:**
- Use clear, concise language
- Include code examples where helpful
- Keep examples up-to-date with code
- Use proper markdown formatting
- Include links to related documentation

## Performance Guidelines

### Backend
- Minimize database queries (use eager loading for relationships)
- Use database indexes appropriately (add indexes for frequently queried fields)
- Implement pagination for large datasets
- Cache frequently accessed data (consider Redis for production)
- Use connection pooling (SQLAlchemy handles this)
- Optimize SQLAlchemy queries (avoid N+1 queries)
- Use async/await for I/O-bound operations

### Frontend
- Optimize bundle size (use code splitting)
- Use lazy loading for routes and components
- Minimize re-renders (use React.memo, useMemo, useCallback)
- Optimize images and assets
- Use Ant Design components efficiently
- Avoid unnecessary API calls (implement caching where appropriate)

### Database
- Add indexes for foreign keys and frequently queried columns
- Use appropriate data types (avoid over-sized types)
- Consider database-level constraints for data integrity
- Monitor query performance

## Security Guidelines

### Secrets Management
- **Never commit secrets or API keys** to version control
- Use `.env` files for local development (already in `.gitignore`)
- Use environment variables for all sensitive configuration
- Never log sensitive information (passwords, tokens, etc.)
- Rotate secrets regularly in production

### Input Validation
- Validate all user inputs using Pydantic schemas (backend)
- Sanitize data before database operations
- Use parameterized queries (SQLAlchemy handles this)
- Validate file uploads (if adding file upload feature)
- Check input length limits

### Authentication & Authorization
- Always verify Google OAuth tokens server-side
- Use JWT tokens with appropriate expiration times
- Validate JWT tokens on protected endpoints
- Implement proper CORS configuration
- Use secure session management

### API Security
- Use HTTPS in production (never HTTP)
- Implement rate limiting (consider using FastAPI middleware)
- Validate request origins
- Use secure headers (CORS, CSP, etc.)
- Follow OWASP Top 10 security practices

### Google OAuth Specific
- Verify Google tokens on the backend (never trust client-side only)
- Validate token audience matches your Client ID
- Handle token expiration gracefully
- Store Google user data securely
- Respect user privacy and data protection regulations

## Development Workflow

### Using Makefile Commands

The project includes a comprehensive Makefile. See [MAKEFILE.md](MAKEFILE.md) for all available commands.

**Common Commands:**
```bash
# Setup
make setup              # Complete project setup
make install            # Install all dependencies

# Development
make docker-dev-up      # Start development environment with hot-reload
make dev-backend        # Start backend only (local)
make dev-frontend       # Start frontend only (local)

# Testing
make test-backend       # Run backend tests
make lint               # Run all linters

# Docker
make docker-up-build    # Build and start production containers
make docker-logs        # View container logs
make docker-down        # Stop containers

# Database
make db-shell           # Access PostgreSQL shell
make db-backup          # Backup database
```

### Docker Development

For development with hot-reload:
```bash
make docker-dev-up
```

This starts:
- PostgreSQL database
- Backend with hot-reload (port 8000)
- Frontend with Vite dev server (port 5173)

### Local Development

For local development without Docker:
```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Note:** Ensure PostgreSQL is running locally and environment variables are configured.

## Release Process

1. **Update versions**
   - Update version in `frontend/package.json`
   - Update version in `backend/app/main.py` (FastAPI app version)
   - Update version in `README.md` if documented

2. **Create release notes**
   - Document new features
   - Document bug fixes
   - Document breaking changes (if any)
   - Document migration steps (if database changes)

3. **Test production build**
   ```bash
   make docker-up-build
   # Test thoroughly
   ```

4. **Tag release in git**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

5. **Deploy**
   - Deploy to staging first
   - Verify staging deployment
   - Deploy to production after verification

## Getting Help

- **Check existing documentation**
  - [README.md](../README.md) - Main project documentation
  - [QUICKSTART.md](QUICKSTART.md) - Setup guide
  - [DOCKER.md](DOCKER.md) - Docker deployment guide
  - [MAKEFILE.md](MAKEFILE.md) - Available commands

- **Search existing issues**
  - Search closed issues for similar problems
  - Check if your question has been answered

- **Open a new issue**
  - Use issue templates if available
  - Provide clear description and steps to reproduce
  - Include relevant logs and environment details

- **For code questions**
  - Review existing code examples
  - Check FastAPI documentation: https://fastapi.tiangolo.com/
  - Check React documentation: https://react.dev/
  - Check Ant Design documentation: https://ant.design/

## Environment Variables

When adding new features that require configuration:

1. **Backend** - Add to `backend/.env.example`:
   ```bash
   NEW_FEATURE_ENABLED=true
   NEW_API_KEY=your-api-key-here
   ```

2. **Frontend** - Add to `frontend/.env.example`:
   ```bash
   VITE_NEW_FEATURE_URL=http://localhost:8000
   ```

3. **Update documentation**
   - Add to README.md environment variables section
   - Update QUICKSTART.md if setup is required
   - Document in code comments

4. **Update configuration files**
   - `backend/app/core/config.py` - Add settings class attributes
   - `frontend/src/config/api.js` - Add frontend config

## Linting and Code Quality

### Backend Linting

```bash
# Using Makefile
make lint-backend

# Or manually (requires flake8)
cd backend
source venv/bin/activate
flake8 app/ --max-line-length=120 --exclude=venv
```

**Python Linting Standards:**
- Follow PEP 8
- Maximum line length: 120 characters
- Use type hints
- Document complex functions

### Frontend Linting

```bash
# Using Makefile
make lint-frontend

# Or manually
cd frontend
npm run lint
```

**JavaScript/React Linting Standards:**
- Follow ESLint rules (configured in `eslint.config.js`)
- Use consistent formatting
- Fix all linting errors before committing

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Git commit history

Thank you for contributing to this project! Your efforts help make this project better for everyone.
