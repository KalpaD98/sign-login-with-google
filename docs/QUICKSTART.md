# Quick Start Guide

Get up and running in under 5 minutes!

## Overview

This application uses the **Google ID Token flow** for authentication, which is the most common and secure approach for React, FastAPI, and PostgreSQL stacks. Here's how it works:

1. **Frontend (React)**: User clicks "Sign in with Google" → Google returns an ID token
2. **Backend (FastAPI)**: Receives the token → Verifies it using Google's public keys → Creates/updates user in PostgreSQL
3. **Database (PostgreSQL)**: Stores user information securely

The ID Token flow is secure because tokens are cryptographically signed by Google and verified on the backend without needing a Client Secret.

## Prerequisites

- Node.js 18+ and npm installed
- Python 3.9+ installed
- Docker and Docker Compose installed
- Google OAuth credentials ([Get them here](https://console.cloud.google.com/))

## Step 1: Configure Google OAuth Credentials

To integrate Sign In with Google into your React, FastAPI, and PostgreSQL stack, the most common and secure approach is using the **ID Token flow**. 

The overall process involves:
- Setting up credentials on Google Cloud
- Implementing the sign-in button in React to receive a token
- Sending that token to your FastAPI backend
- Verifying it on the backend
- Managing the user in your PostgreSQL database

### Get Your Google API Client ID

You need a Google API Client ID to use Google services:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **OAuth consent screen** and configure the required app information:
   - App name
   - Support email
   - Other required fields
4. Navigate to **APIs & Services** > **Credentials**
5. Click **+ Create Credentials** > **OAuth client ID**
6. Select **Web application** as the Application type
7. In **Authorized JavaScript origins**, add your React app's URL:
   - `http://localhost:5173` (for development)
   - Your production URL (when deploying)
8. Click **Create** and copy your **Client ID**
   
   > **Note:** You generally won't need the Client Secret for this token-based flow, as the token is verified using Google's public keys on the backend.

## Step 2: Clone and Setup

### Option A: Using Setup Script (Linux/macOS)

```bash
# Clone repository
git clone <repo-url>
cd sign-login-with-google

# Run setup script
chmod +x setup.sh
./setup.sh
```

### Option B: Manual Setup (Windows or if script fails)

```bash
# Backend setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux
cd ..

# Frontend setup
cd frontend
npm install
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux
cd ..
```

## Step 3: Configure Environment Variables

### 1. Backend Configuration
Create and edit `backend/.env`:

```bash
# Copy example file
cd backend
cp .env.example .env
```

Edit `backend/.env` to add your Google Client ID:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/google_auth_db
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=  # Optional - not needed for ID Token flow
SECRET_KEY=your-secret-key-here
```

### 2. Frontend Configuration
Create and edit `frontend/.env`:

```bash
# Copy example file
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env` to add your Google Client ID:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8000
```

> **Important:** The `GOOGLE_CLIENT_ID` in the backend and `VITE_GOOGLE_CLIENT_ID` in the frontend must match exactly.

### Generate a Secure Secret Key
To generate a secure `SECRET_KEY` for the backend:
```bash
openssl rand -hex 32
```


## Step 4: Run Database Migrations

```bash
cd backend
alembic upgrade head
cd ..
```

## Step 5: Start the Application

Start everything with Docker and hot-reload:

```bash
make docker-up
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Stop services:**
```bash
make docker-down
```

### Option B: Local Development

**Terminal 1: Start Backend**

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2: Start Frontend**

```bash
cd frontend
npm run dev
```

## Step 6: Test the Application

1. Open http://localhost:5173 in your browser
2. Click the "Sign in with Google" button
3. Select your Google account
4. Authorize the application
5. You should see your profile information displayed!

## Development Commands

Common commands:
- `make docker-up` - Start with hot-reload
- `make docker-logs` - View logs
- `make docker-down` - Stop services
- `make dev-backend` - Start backend only
- `make dev-frontend` - Start frontend only
- `pytest tests/ -v` - Run tests

## Hot-Reload

Changes in `frontend/src/` and `backend/app/` are automatically reflected when using `make docker-up` or local development servers.

## Troubleshooting

### Port already in use?
```bash
lsof -i :5173  # Frontend
lsof -i :8000  # Backend
```

### Database connection error?
```bash
# Check if postgres is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart
```

### Changes not reflecting in Docker?
- Ensure you're using `make docker-up`
- Check logs: `make docker-logs`
- Restart services: `make docker-down && make docker-up`

### GOOGLE_CLIENT_ID not set?
- Verify `frontend/.env` exists and has `VITE_GOOGLE_CLIENT_ID` set
- Check that value matches Google Console credentials

### Invalid token on Google Sign-In?
- Verify Client ID matches in both Google Console and `.env` files
- Check that authorized JavaScript origins are correctly configured in Google Console
- Ensure the OAuth consent screen is properly configured
- Verify the token is being sent correctly from the frontend

## Next Steps

- Customize the UI in `frontend/src/components/`
- Add more API endpoints in `backend/app/routes/`
- Check API docs: http://localhost:8000/docs
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines

## Documentation

- **README.md** - Project overview
- **DOCKER.md** - Docker deployment guide
- **MAKEFILE.md** - Make commands reference
- **CONTRIBUTING.md** - Contribution guidelines
