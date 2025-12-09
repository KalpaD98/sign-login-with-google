# Contributing Guide

Thank you for considering contributing to this project! This guide will help you get started.

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
   - Environment details (OS, Node version, Python version)

### Suggesting Enhancements

1. Check existing feature requests
2. Open a new issue with:
   - Clear use case
   - Expected behavior
   - Why this enhancement would be useful
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test your changes
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker and Docker Compose
- Git

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/KalpaD98/sign-login-with-google.git
cd sign-login-with-google

# Run setup script
./setup.sh

# Configure environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your credentials
```

## Coding Standards

### Backend (Python)

- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Keep functions focused and small
- Use async/await for I/O operations

**Example:**
```python
async def create_user(user_data: UserCreate, db: Session) -> User:
    """
    Create a new user in the database.
    
    Args:
        user_data: User creation data
        db: Database session
        
    Returns:
        Created user object
    """
    user = User(**user_data.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```

### Frontend (JavaScript/React)

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and component names
- Keep components small and focused
- Use destructuring where appropriate

**Example:**
```javascript
const UserProfile = ({ user, onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
};
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

### Backend Tests

```bash
cd backend
source venv/bin/activate
pytest
```

Write tests for:
- New endpoints
- New database models
- Utility functions
- Authentication logic

### Frontend Tests

```bash
cd frontend
npm test
```

Write tests for:
- New components
- API service functions
- Authentication flows
- User interactions

### Manual Testing

Before submitting a PR:
1. Test all changed functionality
2. Test error cases
3. Verify existing features still work
4. Test on different browsers (Chrome, Firefox, Safari)
5. Test responsive design on mobile

## Code Review Process

1. All PRs require at least one review
2. Address all review comments
3. Keep PR scope focused
4. Update documentation if needed
5. Ensure CI/CD checks pass

## Project Structure

### Backend
```
backend/
├── app/
│   ├── core/          # Configuration, database, security
│   ├── models/        # SQLAlchemy models
│   ├── routes/        # API endpoints
│   ├── schemas/       # Pydantic schemas
│   └── main.py        # FastAPI app
├── tests/             # Test files
└── requirements.txt   # Python dependencies
```

### Frontend
```
frontend/
├── src/
│   ├── components/    # React components
│   ├── services/      # API services
│   ├── config/        # Configuration
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
└── package.json       # Node dependencies
```

## Adding New Features

### Backend: New Endpoint

1. Create schema in `schemas/`
2. Add endpoint in `routes/`
3. Update OpenAPI docs with descriptions
4. Add tests in `tests/`
5. Update README if needed

### Frontend: New Component

1. Create component in `components/`
2. Add necessary styling
3. Import and use in parent component
4. Add props validation
5. Test component rendering

### Database: New Model

1. Create model in `models/`
2. Add migrations with Alembic
3. Update schemas
4. Add database operations
5. Test model CRUD operations

## Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying configuration
- Updating dependencies
- Changing setup process

Files to update:
- `README.md` - Main documentation
- `QUICKSTART.md` - Quick start guide
- `ARCHITECTURE.md` - Architecture details
- API documentation strings
- Code comments

## Performance Guidelines

- Minimize database queries
- Use database indexes appropriately
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize bundle size for frontend
- Use lazy loading where appropriate

## Security Guidelines

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Sanitize data before database operations
- Use HTTPS in production
- Implement rate limiting
- Follow OWASP security practices

## Release Process

1. Update version in `package.json` and relevant files
2. Update CHANGELOG.md
3. Create release notes
4. Tag release in git
5. Build and test production build
6. Deploy to staging first
7. Deploy to production after verification

## Getting Help

- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Open a new issue with questions
- Join community chat (if available)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🎉
