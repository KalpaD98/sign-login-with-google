# Quick Start Guide

This guide will help you get the application up and running in minutes.

## Prerequisites

Ensure you have:
- Node.js 18+ and npm installed
- Python 3.9+ installed
- Docker and Docker Compose installed

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

## Step 2: Automated Setup

Run the setup script to install all dependencies:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Create Python virtual environment
- Install backend dependencies
- Install frontend dependencies
- Start PostgreSQL with Docker
- Create `.env` files from templates

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

## Step 4: Start the Application

### Terminal 1: Start Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Or use the convenience script:
```bash
cd backend
./run.sh
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

## Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API Docs**: http://localhost:8000/docs
- **Backend Health Check**: http://localhost:8000/health

## Step 6: Test Google Sign-In

1. Open http://localhost:5173 in your browser
2. Click the "Sign in with Google" button
3. Select your Google account
4. Authorize the application
5. You should see your profile information displayed!

## Troubleshooting

### Issue: "GOOGLE_CLIENT_ID not set"
- Make sure you've created `frontend/.env` and added your Client ID

### Issue: "Database connection error"
- Ensure PostgreSQL is running: `docker-compose ps`
- Restart PostgreSQL: `docker-compose restart`

### Issue: "Invalid token" on Google Sign-In
- Verify your Client ID matches in both Google Console and `.env` files
- Check that authorized origins are correctly configured in Google Console

### Issue: Port already in use
- Backend: Change port in `backend/run.sh` or when running uvicorn
- Frontend: Vite will automatically try the next available port

## Next Steps

- Customize the UI in `frontend/src/components/`
- Add more API endpoints in `backend/app/routes/`
- Implement additional features like user roles, permissions, etc.

## Useful Commands

### Backend
```bash
# Activate virtual environment
source backend/venv/bin/activate

# Run migrations (when you add them)
cd backend
alembic upgrade head

# Run tests (when implemented)
pytest
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Database
```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d google_auth_db
```

## Support

If you encounter any issues, please check:
1. All environment variables are set correctly
2. PostgreSQL is running (`docker-compose ps`)
3. Backend server is running (check terminal output)
4. Frontend is running (check terminal output)
5. Google OAuth credentials are valid and authorized origins are correct
