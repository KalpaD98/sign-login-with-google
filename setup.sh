#!/bin/bash

echo "========================================="
echo "Setting up Sign-in with Google Project"
echo "========================================="
echo ""
echo "Note: This script is for Unix-like systems (Linux, macOS)."
echo "For Windows, see QUICKSTART.md for manual setup instructions."
echo ""

# Backend setup
echo ""
echo "Setting up backend..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
# Note: On Windows use: venv\Scripts\activate
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Create .env from example
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your Google OAuth credentials!"
fi

cd ..

# Frontend setup
echo ""
echo "Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env from example
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update frontend/.env with your Google Client ID!"
fi

cd ..

# Docker setup
echo ""
echo "Starting PostgreSQL database..."
docker-compose up -d

echo ""
echo "========================================="
echo "Setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your Google OAuth credentials"
echo "2. Update frontend/.env with your Google Client ID"
echo "3. Start the backend: cd backend && ./run.sh"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "Access the application at: http://localhost:5173"
echo "Access the API docs at: http://localhost:8000/docs"
echo ""
