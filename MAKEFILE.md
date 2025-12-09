# Makefile Documentation

This document describes all available `make` commands for automating development, testing, and deployment tasks.

## Prerequisites

The Makefile requires the following tools to be installed:
- Python 3.9+
- Node.js 18+
- Docker and Docker Compose
- Make (usually pre-installed on Unix systems)

Run `make check-deps` to verify all dependencies are installed.

## Quick Start

```bash
# See all available commands
make help

# Complete project setup
make setup

# Start development
make dev-backend  # Terminal 1
make dev-frontend # Terminal 2
```

## Command Categories

### General

| Command | Description |
|---------|-------------|
| `make help` | Display help message with all available commands |
| `make check-deps` | Verify all required dependencies are installed |
| `make status` | Show status of services and environment |
| `make info` | Display project information and URLs |

### Setup & Installation

| Command | Description |
|---------|-------------|
| `make setup` | Complete project setup (env files + dependencies) |
| `make install` | Install all dependencies (backend + frontend) |
| `make install-backend` | Install backend Python dependencies |
| `make install-frontend` | Install frontend Node.js dependencies |
| `make setup-env` | Create .env files from examples |

**Example:**
```bash
# First-time setup
make setup

# Edit environment files
vim backend/.env
vim frontend/.env
vim .env
```

### Development

| Command | Description |
|---------|-------------|
| `make dev` | Start both backend and frontend (not recommended, use separate terminals) |
| `make dev-backend` | Start backend development server on port 8000 |
| `make dev-frontend` | Start frontend development server on port 5173 |

**Example:**
```bash
# Terminal 1
make dev-backend

# Terminal 2 (in another terminal)
make dev-frontend
```

**Development URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Docker

| Command | Description |
|---------|-------------|
| `make docker-build` | Build Docker images |
| `make docker-up` | Start all services with Docker Compose |
| `make docker-up-build` | Build and start all services |
| `make docker-down` | Stop all Docker services |
| `make docker-restart` | Restart all Docker services |
| `make docker-restart-backend` | Restart only backend service |
| `make docker-restart-frontend` | Restart only frontend service |
| `make docker-logs` | View logs from all services |
| `make docker-logs-backend` | View backend logs only |
| `make docker-logs-frontend` | View frontend logs only |
| `make docker-logs-db` | View database logs only |
| `make docker-ps` | List running Docker containers |
| `make docker-clean` | Remove all Docker containers, volumes, and images |

**Example:**
```bash
# Build and start with Docker
make docker-up-build

# View logs in real-time
make docker-logs

# Stop services
make docker-down
```

**Docker URLs:**
- Frontend: http://localhost (port 80)
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Database

| Command | Description |
|---------|-------------|
| `make db-shell` | Access PostgreSQL shell |
| `make db-backup` | Backup database to timestamped SQL file |
| `make db-restore FILE=backup.sql` | Restore database from backup file |

**Example:**
```bash
# Access database shell
make db-shell

# Backup database
make db-backup

# Restore from backup
make db-restore FILE=backup_20241209_120000.sql
```

### Testing

| Command | Description |
|---------|-------------|
| `make test` | Run all tests |
| `make test-backend` | Run backend tests with pytest |

**Example:**
```bash
# Run all tests
make test

# Run only backend tests
make test-backend
```

### Linting & Code Quality

| Command | Description |
|---------|-------------|
| `make lint` | Run all linters (backend + frontend) |
| `make lint-backend` | Run Python linter (flake8) |
| `make lint-frontend` | Run JavaScript linter (ESLint) |

**Example:**
```bash
# Lint all code
make lint

# Lint only frontend
make lint-frontend
```

### Building

| Command | Description |
|---------|-------------|
| `make build` | Build all production assets |
| `make build-frontend` | Build frontend for production |

**Example:**
```bash
# Build frontend for production
make build-frontend

# Output will be in frontend/dist/
```

### Cleaning

| Command | Description |
|---------|-------------|
| `make clean` | Clean all build artifacts and caches |
| `make clean-backend` | Clean backend artifacts (__pycache__, .pyc files) |
| `make clean-frontend` | Clean frontend artifacts (dist/, .vite/) |
| `make clean-all` | Clean everything including venv and node_modules |

**Example:**
```bash
# Clean build artifacts
make clean

# Clean everything (requires reinstall after)
make clean-all
```

## Common Workflows

### First-Time Setup

```bash
# 1. Check prerequisites
make check-deps

# 2. Run setup
make setup

# 3. Configure environment variables
vim backend/.env      # Add Google OAuth credentials
vim frontend/.env     # Add Google Client ID
vim .env             # For Docker deployment

# 4. Start development
make dev-backend     # Terminal 1
make dev-frontend    # Terminal 2
```

### Daily Development

```bash
# Start backend (Terminal 1)
make dev-backend

# Start frontend (Terminal 2)
make dev-frontend

# Run tests when needed
make test

# Lint code before committing
make lint
```

### Docker Development

```bash
# Build and start everything
make docker-up-build

# View logs
make docker-logs

# Restart after code changes
make docker-restart-backend

# Stop everything
make docker-down
```

### Before Committing

```bash
# Lint code
make lint

# Run tests
make test

# Clean artifacts
make clean
```

### Production Build

```bash
# Build frontend
make build-frontend

# Build Docker images
make docker-build
```

### Troubleshooting

```bash
# Check status of everything
make status

# Clean and rebuild
make clean
make install
make docker-build

# View logs
make docker-logs

# Restart specific service
make docker-restart-backend
```

## Environment Variables

The Makefile uses the following environment files:

| File | Purpose |
|------|---------|
| `backend/.env` | Backend configuration (local development) |
| `frontend/.env` | Frontend configuration (local development) |
| `.env` | Docker Compose configuration |

Run `make setup-env` to create these files from examples.

## Tips and Tricks

### Running Commands in Parallel

```bash
# Not recommended (hard to see output)
make dev

# Recommended: Use separate terminals
make dev-backend  # Terminal 1
make dev-frontend # Terminal 2
```

### Using tmux or screen

```bash
# With tmux
tmux new-session -d -s backend 'make dev-backend'
tmux new-session -d -s frontend 'make dev-frontend'
tmux attach -t backend

# Attach to either session with:
tmux attach -t backend
tmux attach -t frontend
```

### Viewing Multiple Logs

```bash
# All services
make docker-logs

# Specific service in new terminal
make docker-logs-backend  # Terminal 1
make docker-logs-frontend # Terminal 2
```

### Database Management

```bash
# Quick backup before major changes
make db-backup

# Backup creates: backup_YYYYMMDD_HHMMSS.sql

# Restore if needed
make db-restore FILE=backup_20241209_120000.sql
```

### Checking What's Running

```bash
# See all service status
make status

# See Docker containers
make docker-ps

# See project info
make info
```

## Makefile Customization

The Makefile can be customized by editing the file directly. Common customizations:

### Change Ports

Edit the `dev-backend` target to use a different port:
```makefile
dev-backend:
	@cd backend && . venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

### Add New Commands

Add custom commands following this pattern:
```makefile
my-command: ## Description of my command
	@echo "Running my command..."
	@# Your commands here
```

### Modify Colors

Change color codes at the top of the Makefile:
```makefile
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m
```

## Troubleshooting

### "make: command not found"

Install make:
```bash
# Ubuntu/Debian
sudo apt-get install make

# macOS (should be pre-installed with Xcode Command Line Tools)
xcode-select --install

# Windows (use WSL or Git Bash)
```

### Permission Denied

Some commands may need executable permissions:
```bash
chmod +x backend/run.sh
chmod +x setup.sh
```

### Docker Commands Not Working

Ensure Docker is running:
```bash
docker ps
docker-compose version
```

### Virtual Environment Issues

Clean and recreate:
```bash
rm -rf backend/venv
make install-backend
```

### Node Modules Issues

Clean and reinstall:
```bash
rm -rf frontend/node_modules
make install-frontend
```

## Additional Resources

- [Main README](README.md) - Project overview
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [DOCKER.md](DOCKER.md) - Docker deployment guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## Support

For issues or questions:
1. Run `make status` to check system state
2. Run `make check-deps` to verify dependencies
3. Check the relevant documentation
4. Open an issue on GitHub
