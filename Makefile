.PHONY: help install install-backend install-frontend setup setup-env clean clean-backend clean-frontend \
        dev dev-backend dev-frontend docker-build docker-up docker-down docker-logs docker-clean \
        test test-backend lint lint-backend lint-frontend build build-frontend check-deps

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Docker Compose command (supports both v1 and v2)
DOCKER_COMPOSE := $(shell if command -v docker-compose >/dev/null 2>&1; then echo "docker-compose"; else echo "docker compose"; fi)

##@ General

help: ## Display this help message
	@echo "$(BLUE)Sign-in with Google - Makefile Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(GREEN)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Setup & Installation

install: install-backend install-frontend ## Install all dependencies (backend + frontend)
	@echo "$(GREEN)✓ All dependencies installed successfully$(NC)"

install-backend: ## Install backend Python dependencies
	@echo "$(BLUE)Installing backend dependencies...$(NC)"
	@cd backend && \
		if [ ! -d "venv" ]; then python3 -m venv venv; fi && \
		. venv/bin/activate && \
		pip install -r requirements.txt
	@echo "$(GREEN)✓ Backend dependencies installed$(NC)"

install-frontend: ## Install frontend Node.js dependencies
	@echo "$(BLUE)Installing frontend dependencies...$(NC)"
	@cd frontend && npm install
	@echo "$(GREEN)✓ Frontend dependencies installed$(NC)"

setup: setup-env install ## Complete project setup (env files + dependencies)
	@echo ""
	@echo "$(GREEN)=========================================$(NC)"
	@echo "$(GREEN)Setup complete!$(NC)"
	@echo "$(GREEN)=========================================$(NC)"
	@echo ""
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "1. Update backend/.env with your Google OAuth credentials"
	@echo "2. Update frontend/.env with your Google Client ID"
	@echo "3. Start development: make dev"
	@echo ""

setup-env: ## Create .env files from examples
	@echo "$(BLUE)Setting up environment files...$(NC)"
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env && \
		echo "$(YELLOW)⚠️  Created backend/.env - please update with your credentials$(NC)"; \
	else \
		echo "$(GREEN)✓ backend/.env already exists$(NC)"; \
	fi
	@if [ ! -f frontend/.env ]; then \
		cp frontend/.env.example frontend/.env && \
		echo "$(YELLOW)⚠️  Created frontend/.env - please update with your credentials$(NC)"; \
	else \
		echo "$(GREEN)✓ frontend/.env already exists$(NC)"; \
	fi
	@if [ ! -f .env ]; then \
		cp .env.docker.example .env && \
		echo "$(YELLOW)⚠️  Created .env - please update with your credentials$(NC)"; \
	else \
		echo "$(GREEN)✓ .env already exists$(NC)"; \
	fi

##@ Development

dev: ## Start both backend and frontend in development mode (use tmux/screen recommended)
	@echo "$(YELLOW)Starting development servers...$(NC)"
	@echo "$(YELLOW)Note: This will start both servers. Use Ctrl+C to stop.$(NC)"
	@echo "$(YELLOW)Recommended: Run 'make dev-backend' and 'make dev-frontend' in separate terminals$(NC)"
	@$(MAKE) -j2 dev-backend dev-frontend

dev-backend: ## Start backend development server
	@echo "$(BLUE)Starting backend server...$(NC)"
	@cd backend && . venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Start frontend development server
	@echo "$(BLUE)Starting frontend server...$(NC)"
	@cd frontend && npm run dev

##@ Docker

docker-build: ## Build Docker images
	@echo "$(BLUE)Building Docker images...$(NC)"
	@$(DOCKER_COMPOSE) build
	@echo "$(GREEN)✓ Docker images built$(NC)"

docker-up: ## Start all services with Docker Compose
	@echo "$(BLUE)Starting Docker services...$(NC)"
	@$(DOCKER_COMPOSE) up -d
	@echo ""
	@echo "$(GREEN)✓ Services started$(NC)"
	@echo "Frontend: http://localhost"
	@echo "Backend API: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"
	@echo ""
	@echo "View logs: make docker-logs"
	@echo "Stop services: make docker-down"

docker-up-build: ## Build and start all services with Docker Compose
	@echo "$(BLUE)Building and starting Docker services...$(NC)"
	@$(DOCKER_COMPOSE) up -d --build
	@echo ""
	@echo "$(GREEN)✓ Services started$(NC)"
	@echo "Frontend: http://localhost"
	@echo "Backend API: http://localhost:8000"
	@echo "API Docs: http://localhost:8000/docs"

docker-down: ## Stop all Docker services
	@echo "$(BLUE)Stopping Docker services...$(NC)"
	@$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✓ Services stopped$(NC)"

docker-logs: ## View Docker logs
	@$(DOCKER_COMPOSE) logs -f

docker-logs-backend: ## View backend Docker logs
	@$(DOCKER_COMPOSE) logs -f backend

docker-logs-frontend: ## View frontend Docker logs
	@$(DOCKER_COMPOSE) logs -f frontend

docker-logs-db: ## View database Docker logs
	@$(DOCKER_COMPOSE) logs -f postgres

docker-ps: ## List running Docker containers
	@$(DOCKER_COMPOSE) ps

docker-clean: ## Remove all Docker containers, volumes, and images
	@echo "$(RED)Removing all Docker resources...$(NC)"
	@$(DOCKER_COMPOSE) down -v --rmi all
	@echo "$(GREEN)✓ Docker resources cleaned$(NC)"

docker-restart: docker-down docker-up ## Restart all Docker services

docker-restart-backend: ## Restart only backend service
	@$(DOCKER_COMPOSE) restart backend

docker-restart-frontend: ## Restart only frontend service
	@$(DOCKER_COMPOSE) restart frontend

##@ Database

db-shell: ## Access PostgreSQL shell
	@$(DOCKER_COMPOSE) exec postgres psql -U postgres -d google_auth_db

db-backup: ## Backup database to file
	@echo "$(BLUE)Backing up database...$(NC)"
	@$(DOCKER_COMPOSE) exec postgres pg_dump -U postgres google_auth_db > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Database backed up$(NC)"

db-restore: ## Restore database from backup (usage: make db-restore FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)Error: Please specify FILE=backup.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Restoring database from $(FILE)...$(NC)"
	@$(DOCKER_COMPOSE) exec -T postgres psql -U postgres google_auth_db < $(FILE)
	@echo "$(GREEN)✓ Database restored$(NC)"

##@ Testing

test: test-backend ## Run all tests
	@echo "$(GREEN)✓ All tests completed$(NC)"

test-backend: ## Run backend tests
	@echo "$(BLUE)Running backend tests...$(NC)"
	@cd backend && . venv/bin/activate && pytest
	@echo "$(GREEN)✓ Backend tests passed$(NC)"

##@ Linting & Code Quality

lint: lint-backend lint-frontend ## Run all linters
	@echo "$(GREEN)✓ Linting complete$(NC)"

lint-backend: ## Run backend linter (Python)
	@echo "$(BLUE)Linting backend code...$(NC)"
	@cd backend && . venv/bin/activate && \
		python -m flake8 app/ --max-line-length=120 --exclude=venv || \
		echo "$(YELLOW)Note: Install flake8 with 'pip install flake8' for linting$(NC)"

lint-frontend: ## Run frontend linter (ESLint)
	@echo "$(BLUE)Linting frontend code...$(NC)"
	@cd frontend && npm run lint

##@ Building

build: build-frontend ## Build all production assets
	@echo "$(GREEN)✓ Build complete$(NC)"

build-frontend: ## Build frontend for production
	@echo "$(BLUE)Building frontend...$(NC)"
	@cd frontend && npm run build
	@echo "$(GREEN)✓ Frontend built$(NC)"

##@ Cleaning

clean: clean-backend clean-frontend ## Clean all build artifacts and caches
	@echo "$(GREEN)✓ Cleaned all artifacts$(NC)"

clean-backend: ## Clean backend artifacts
	@echo "$(BLUE)Cleaning backend...$(NC)"
	@find backend -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find backend -type f -name "*.pyc" -delete 2>/dev/null || true
	@find backend -type f -name "*.pyo" -delete 2>/dev/null || true
	@find backend -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	@rm -rf backend/.pytest_cache 2>/dev/null || true
	@echo "$(GREEN)✓ Backend cleaned$(NC)"

clean-frontend: ## Clean frontend artifacts
	@echo "$(BLUE)Cleaning frontend...$(NC)"
	@rm -rf frontend/dist 2>/dev/null || true
	@rm -rf frontend/.vite 2>/dev/null || true
	@echo "$(GREEN)✓ Frontend cleaned$(NC)"

clean-all: clean docker-clean ## Clean everything including Docker resources
	@rm -rf backend/venv 2>/dev/null || true
	@rm -rf frontend/node_modules 2>/dev/null || true
	@echo "$(GREEN)✓ Everything cleaned$(NC)"

##@ Utilities

check-deps: ## Check if required dependencies are installed
	@echo "$(BLUE)Checking dependencies...$(NC)"
	@command -v python3 >/dev/null 2>&1 || { echo "$(RED)✗ Python 3 not found$(NC)"; exit 1; }
	@echo "$(GREEN)✓ Python 3 found: $$(python3 --version)$(NC)"
	@command -v node >/dev/null 2>&1 || { echo "$(RED)✗ Node.js not found$(NC)"; exit 1; }
	@echo "$(GREEN)✓ Node.js found: $$(node --version)$(NC)"
	@command -v npm >/dev/null 2>&1 || { echo "$(RED)✗ npm not found$(NC)"; exit 1; }
	@echo "$(GREEN)✓ npm found: $$(npm --version)$(NC)"
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)✗ Docker not found$(NC)"; exit 1; }
	@echo "$(GREEN)✓ Docker found: $$(docker --version)$(NC)"
	@if command -v docker-compose >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Docker Compose found: $$(docker-compose version)$(NC)"; \
	elif docker compose version >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Docker Compose found: $$(docker compose version)$(NC)"; \
	else \
		echo "$(RED)✗ Docker Compose not found$(NC)"; \
		exit 1; \
	fi
	@echo ""
	@echo "$(GREEN)✓ All required dependencies are installed$(NC)"

status: ## Show status of all services
	@echo "$(BLUE)=== Docker Services Status ===$(NC)"
	@$(DOCKER_COMPOSE) ps
	@echo ""
	@echo "$(BLUE)=== Backend Status ===$(NC)"
	@if [ -d backend/venv ]; then \
		echo "$(GREEN)✓ Backend virtual environment exists$(NC)"; \
	else \
		echo "$(YELLOW)⚠ Backend virtual environment not found$(NC)"; \
	fi
	@echo ""
	@echo "$(BLUE)=== Frontend Status ===$(NC)"
	@if [ -d frontend/node_modules ]; then \
		echo "$(GREEN)✓ Frontend dependencies installed$(NC)"; \
	else \
		echo "$(YELLOW)⚠ Frontend dependencies not installed$(NC)"; \
	fi
	@echo ""
	@echo "$(BLUE)=== Environment Files ===$(NC)"
	@if [ -f backend/.env ]; then \
		echo "$(GREEN)✓ backend/.env exists$(NC)"; \
	else \
		echo "$(YELLOW)⚠ backend/.env missing$(NC)"; \
	fi
	@if [ -f frontend/.env ]; then \
		echo "$(GREEN)✓ frontend/.env exists$(NC)"; \
	else \
		echo "$(YELLOW)⚠ frontend/.env missing$(NC)"; \
	fi
	@if [ -f .env ]; then \
		echo "$(GREEN)✓ .env exists$(NC)"; \
	else \
		echo "$(YELLOW)⚠ .env missing$(NC)"; \
	fi

info: ## Display project information
	@echo "$(BLUE)=========================================$(NC)"
	@echo "$(BLUE)Sign-in with Google - Project Info$(NC)"
	@echo "$(BLUE)=========================================$(NC)"
	@echo ""
	@echo "$(GREEN)Development URLs:$(NC)"
	@echo "  Frontend (local): http://localhost:5173"
	@echo "  Backend API (local): http://localhost:8000"
	@echo "  API Docs (local): http://localhost:8000/docs"
	@echo ""
	@echo "$(GREEN)Docker URLs:$(NC)"
	@echo "  Frontend (Docker): http://localhost"
	@echo "  Backend API (Docker): http://localhost:8000"
	@echo "  API Docs (Docker): http://localhost:8000/docs"
	@echo ""
	@echo "$(GREEN)Quick Commands:$(NC)"
	@echo "  Setup project: make setup"
	@echo "  Start development: make dev-backend (terminal 1) + make dev-frontend (terminal 2)"
	@echo "  Start with Docker: make docker-up-build"
	@echo "  Run tests: make test"
	@echo "  Clean project: make clean"
	@echo ""
	@echo "For more commands, run: make help"
