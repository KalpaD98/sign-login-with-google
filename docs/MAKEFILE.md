# Makefile Documentation

This document describes all available `make` commands for automating development, testing, and deployment tasks.

## Prerequisites

- Python 3.9+, Node.js 18+, Docker and Docker Compose, Make
- Run `make check-deps` to verify all dependencies are installed

## Quick Start

```bash
make help          # See all available commands
make setup         # Complete project setup
make dev-backend   # Start backend (Terminal 1)
make dev-frontend  # Start frontend (Terminal 2)
```

For detailed setup instructions, see [QUICKSTART.md](QUICKSTART.md).

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


### Development

| Command | Description |
|---------|-------------|
| `make dev` | Start both backend and frontend (not recommended, use separate terminals) |
| `make dev-backend` | Start backend development server on port 8000 |
| `make dev-frontend` | Start frontend development server on port 5173 |


**Development URLs:** Frontend: http://localhost:5173 | Backend: http://localhost:8000 | API Docs: http://localhost:8000/docs

### Docker

#### Production Mode

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


**Production URLs:** Frontend: http://localhost | Backend: http://localhost:8000 | API Docs: http://localhost:8000/docs

#### Development Mode (Hot-Reload)

| Command | Description |
|---------|-------------|
| `make docker-dev-up` | Start development services with hot-reload |
| `make docker-dev-down` | Stop development services |
| `make docker-dev-logs` | View development services logs |
| `make docker-dev-restart` | Restart development services |


**Development URLs:** Frontend: http://localhost:5173 | Backend: http://localhost:8000 | API Docs: http://localhost:8000/docs

**Features:** Hot-reload enabled for both frontend (Vite HMR) and backend (Uvicorn auto-reload)

### Database

| Command | Description |
|---------|-------------|
| `make db-shell` | Access PostgreSQL shell |
| `make db-backup` | Backup database to timestamped SQL file |
| `make db-restore FILE=backup.sql` | Restore database from backup file |


### Testing

| Command | Description |
|---------|-------------|
| `make test` | Run all tests |
| `make test-backend` | Run backend tests with pytest |


### Linting & Code Quality

| Command | Description |
|---------|-------------|
| `make lint` | Run all linters (backend + frontend) |
| `make lint-backend` | Run Python linter (flake8) |
| `make lint-frontend` | Run JavaScript linter (ESLint) |


### Building

| Command | Description |
|---------|-------------|
| `make build` | Build all production assets |
| `make build-frontend` | Build frontend for production |


### Cleaning

| Command | Description |
|---------|-------------|
| `make clean` | Clean all build artifacts and caches |
| `make clean-backend` | Clean backend artifacts (__pycache__, .pyc files) |
| `make clean-frontend` | Clean frontend artifacts (dist/, .vite/) |
| `make clean-all` | Clean everything including venv and node_modules |


## Common Workflows

### First-Time Setup

```bash
make check-deps      # Verify prerequisites
make setup          # Install dependencies and create .env files
# Edit .env files with your credentials
make dev-backend    # Terminal 1
make dev-frontend   # Terminal 2
```

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

### Daily Development

```bash
make dev-backend    # Terminal 1
make dev-frontend   # Terminal 2
make test           # Run tests
make lint           # Lint code
```

### Docker Development

**Development Mode (Recommended):**
```bash
make docker-dev-up    # Start with hot-reload
make docker-dev-logs  # View logs
make docker-dev-down  # Stop
```

**Production Mode:**
```bash
make docker-up-build        # Build and start
make docker-restart-backend # Restart backend
make docker-down            # Stop
```

### Before Committing

```bash
make lint   # Lint code
make test   # Run tests
make clean  # Clean artifacts
```

### Production Build

```bash
make build-frontend  # Build frontend
make docker-build    # Build Docker images
```

### Troubleshooting

```bash
make status              # Check system state
make clean && make install && make docker-build  # Clean rebuild
make docker-logs         # View logs
make docker-restart-backend  # Restart backend
```

## Environment Variables

Run `make setup-env` to create `.env` files from examples. See [QUICKSTART.md](QUICKSTART.md) for configuration details.

## Tips and Tricks

### Tips

- Use separate terminals for `make dev-backend` and `make dev-frontend`
- Use `make docker-dev-up` for hot-reload development
- Run `make status` to check system state
- Use `make db-backup` before major changes

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

Run `make status` to check system state or `make check-deps` to verify dependencies. See [QUICKSTART.md](QUICKSTART.md) for troubleshooting.
