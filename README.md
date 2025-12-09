# Sign-in with Google - Full Stack Application

A modern full-stack application featuring Google OAuth authentication with React 19, Ant Design 6.0.1, FastAPI, and PostgreSQL.

## 🚀 Features

- **Google OAuth Authentication**: Secure sign-in with Google
- **User Profile Management**: Store and display user details (email, first name, last name, profile picture)
- **Modern Frontend**: React 19 with Ant Design 6.0.1
- **Fast Backend**: FastAPI with async support
- **Database**: PostgreSQL for data persistence
- **JWT Authentication**: Secure token-based authentication

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose (for PostgreSQL)
- Google Cloud Console account (for OAuth credentials)

## 🚀 Quick Start

### Option 1: Using Make (Recommended)

Automated setup using Makefile:

```bash
# Check dependencies
make check-deps

# Complete setup (install dependencies + create env files)
make setup

# Edit .env files with your Google OAuth credentials

# Start development servers
make dev-backend  # Terminal 1
make dev-frontend # Terminal 2

# Or use Docker
make docker-up-build
```

Run `make help` to see all available commands.

### Option 2: Docker Compose

Run the entire application stack with a single command:

```bash
# Copy environment template
cp .env.docker.example .env

# Edit .env and add your Google OAuth credentials

# Start all services
docker-compose up --build
```

Access the application at http://localhost

👉 **See [DOCKER.md](DOCKER.md) for complete Docker deployment guide**

### Option 3: Manual Setup

For manual setup instructions, see [QUICKSTART.md](QUICKSTART.md)

For detailed architecture information, see [ARCHITECTURE.md](ARCHITECTURE.md)

## 🔧 Setup Instructions

### 1. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:5173`
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
7. Copy the Client ID and Client Secret

### 2. Database Setup

Start PostgreSQL using Docker Compose:

```bash
docker-compose up -d
```

This will start PostgreSQL on port 5432 with:
- Database: `google_auth_db`
- User: `postgres`
- Password: `postgres`

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Edit .env and add your Google OAuth credentials
# GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
# GOOGLE_CLIENT_SECRET=your-client-secret
```

Start the backend server:

```bash
# From the backend directory
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env and add your Google Client ID
# VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py        # Configuration settings
│   │   │   ├── database.py      # Database connection
│   │   │   └── security.py      # JWT utilities
│   │   ├── models/
│   │   │   └── user.py          # User database model
│   │   ├── routes/
│   │   │   └── auth.py          # Authentication endpoints
│   │   ├── schemas/
│   │   │   └── user.py          # Pydantic schemas
│   │   └── main.py              # FastAPI application
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx        # Login page component
│   │   │   └── UserProfile.jsx  # User profile component
│   │   ├── config/
│   │   │   └── api.js           # Axios configuration
│   │   ├── services/
│   │   │   └── authService.js   # Authentication service
│   │   ├── App.jsx              # Main application
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── .env.example
├── docker-compose.yml           # PostgreSQL setup
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /auth/google` - Authenticate with Google OAuth token
  - Request body: `{ "token": "google-oauth-token" }`
  - Response: `{ "access_token": "jwt-token", "token_type": "bearer", "user": {...} }`

- `GET /auth/me?token=<jwt-token>` - Get current user information
  - Response: User object with email, name, and profile picture

### Health Check

- `GET /` - API information
- `GET /health` - Health check endpoint

## 🎨 Frontend Components

### Login Component
- Displays Google Sign-In button
- Handles authentication flow
- Shows loading and error messages

### UserProfile Component
- Displays user information
- Shows profile picture
- Includes logout functionality

## 🔐 Security Features

- JWT token-based authentication
- Secure token verification with Google
- CORS configuration
- Environment variable protection
- Password hashing support (if needed for future features)

## 🛠️ Technology Stack

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

## 📝 Environment Variables

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

## 🚦 Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend
pytest

# Frontend tests (when implemented)
cd frontend
npm test
```

### Building for Production

Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- KalpaD98

## 🙏 Acknowledgments

- Google OAuth for authentication
- React team for React 19
- Ant Design team for the UI components
- FastAPI team for the excellent framework
