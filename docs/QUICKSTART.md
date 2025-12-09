# Quick Start Guide

Get up and running in under 5 minutes!

## Prerequisites

- Node.js 18+ and npm installed
- Python 3.9+ installed
- Docker and Docker Compose installed
- Google OAuth credentials ([Get them here](https://console.cloud.google.com/))

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:5173`
   - Add Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
   - Click "Create"
   - **Save your Client ID and Client Secret**

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

### Backend Configuration

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/google_auth_db
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
SECRET_KEY=your-secret-key-here
```

To generate a secure SECRET_KEY:
```bash
openssl rand -hex 32
```

### Frontend Configuration

Edit `frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8000
```

## Step 4: Run Database Migrations

```bash
cd backend
alembic upgrade head
cd ..
```

## Step 5: Start the Application

Choose one of these options:

### Option A: Docker Development (Recommended)

Start everything with Docker and hot-reload:

```bash
make docker-dev-up
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Stop services:**
```bash
make docker-dev-down
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

### Option C: Docker Production Mode

For production-like Docker setup:

```bash
make docker-up-build
```

Access at http://localhost

## Step 6: Test the Application

1. Open http://localhost:5173 in your browser
2. Click the "Sign in with Google" button
3. Select your Google account
4. Authorize the application
5. You should see your profile information displayed!

## Development Commands

For all available commands, see [MAKEFILE.md](MAKEFILE.md).

Common commands:
- `make docker-dev-up` - Start with hot-reload
- `make docker-dev-logs` - View logs
- `make docker-dev-down` - Stop services
- `make dev-backend` - Start backend only
- `make dev-frontend` - Start frontend only
- `pytest tests/ -v` - Run tests

## Hot-Reload

Changes in `frontend/src/` and `backend/app/` are automatically reflected when using `make docker-dev-up` or local development servers.

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
- Ensure you're using `make docker-dev-up` (not `docker-compose up`)
- Check logs: `make docker-dev-logs`
- Restart services: `make docker-dev-down && make docker-dev-up`

### GOOGLE_CLIENT_ID not set?
- Verify `frontend/.env` exists and has `VITE_GOOGLE_CLIENT_ID` set
- Check that value matches Google Console credentials

### Invalid token on Google Sign-In?
- Verify Client ID matches in both Google Console and `.env` files
- Check that authorized origins are correctly configured in Google Console
- Ensure API is enabled: Google+ API in Google Cloud Console

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
