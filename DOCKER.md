# Docker Deployment Guide

This guide explains how to run the entire application stack using Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.docker.example .env
```

Edit `.env` and add your Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
SECRET_KEY=your-generated-secret-key
```

Generate a secure SECRET_KEY:
```bash
openssl rand -hex 32
```

**Important**: Do not use the default SECRET_KEY value. The application will use `CHANGE_ME_OR_APP_WILL_FAIL` by default, which is intentionally insecure to prevent accidental production use.

### 2. Configure Google OAuth

In [Google Cloud Console](https://console.cloud.google.com/):

1. Add authorized JavaScript origins:
   - `http://localhost`
   - `http://localhost:80`

2. Add authorized redirect URIs:
   - `http://localhost/auth/google/callback`

### 3. Build and Start Services

```bash
docker-compose up --build
```

Or run in detached mode:
```bash
docker-compose up -d --build
```

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Security Features

The Docker setup includes several security best practices:

- ✅ **Non-root users**: Both backend and frontend containers run as non-root users
- ✅ **Secure SECRET_KEY**: Default value clearly indicates it must be changed
- ✅ **CORS configuration**: Properly configured for allowed origins
- ✅ **Security headers**: Nginx includes X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- ✅ **Health checks**: PostgreSQL has health checks to ensure database is ready
- ✅ **Network isolation**: Services communicate via dedicated Docker network
- ✅ **.dockerignore**: Prevents sensitive files from being included in images

## Docker Compose Services

### Services Overview

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| `postgres` | google_auth_postgres | 5432 | PostgreSQL 16 database |
| `backend` | google_auth_backend | 8000 | FastAPI backend server |
| `frontend` | google_auth_frontend | 80 | React frontend (nginx) |

### Service Dependencies

```
frontend → backend → postgres
```

- Frontend depends on backend being ready
- Backend depends on postgres being healthy
- Postgres has health checks to ensure it's ready

## Docker Commands

### Start Services

```bash
# Start all services in foreground
docker-compose up

# Start all services in background
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Start specific service
docker-compose up backend
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Follow logs for specific service
docker-compose logs -f backend
```

### Rebuild Services

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild without cache
docker-compose build --no-cache
```

### Execute Commands in Containers

```bash
# Access backend container shell
docker-compose exec backend /bin/bash

# Access frontend container shell
docker-compose exec frontend /bin/sh

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d google_auth_db

# Run database migrations (when implemented)
docker-compose exec backend alembic upgrade head
```

### Check Service Status

```bash
# List running containers
docker-compose ps

# View resource usage
docker stats
```

## Frontend Configuration for Docker

The frontend is built as a static site and served by nginx. To configure the API URL:

1. Before building, create `frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8000
```

2. Rebuild the frontend:
```bash
docker-compose build frontend
docker-compose up -d frontend
```

## Development vs Production

### Development Mode

For development, use the local setup instead of Docker:

```bash
# Backend (Terminal 1)
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Production Mode

For production deployment:

1. Update `docker-compose.yml`:
   - Change `CORS_ORIGINS` to your production domain
   - Use strong `SECRET_KEY`
   - Configure proper domain names

2. Use environment-specific configurations:
   - Set `ENVIRONMENT=production` in backend environment
   - Use production-grade PostgreSQL (managed service)
   - Add SSL/TLS certificates for HTTPS
   - Configure proper nginx security headers

3. Consider using `docker-compose.prod.yml`:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Issue: Backend can't connect to database

**Solution:**
```bash
# Check if postgres is healthy
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Issue: Frontend shows "Network Error"

**Solution:**
1. Check if backend is running: `curl http://localhost:8000/health`
2. Verify CORS settings in backend
3. Check backend logs: `docker-compose logs backend`

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using the port
lsof -i :8000  # Backend port
lsof -i :80    # Frontend port
lsof -i :5432  # Postgres port

# Stop the process or change ports in docker-compose.yml
```

### Issue: Database data is lost after restart

**Solution:**
- Don't use `docker-compose down -v` (removes volumes)
- Use `docker-compose stop` or `docker-compose down` (without -v)

### Issue: Build fails

**Solution:**
```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Data Persistence

### Database Data

PostgreSQL data is persisted in a Docker volume named `postgres_data`. This ensures data survives container restarts.

To backup the database:
```bash
# Backup
docker-compose exec postgres pg_dump -U postgres google_auth_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres google_auth_db < backup.sql
```

### Removing Data

To completely remove all data:
```bash
docker-compose down -v
```

## Scaling

To run multiple backend instances:

```bash
docker-compose up --scale backend=3
```

You'll need to add a load balancer (nginx/traefik) in front of the backend services.

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Frontend availability
curl http://localhost

# Database connectivity
docker-compose exec backend python -c "from app.core.database import engine; engine.connect()"
```

### Resource Usage

```bash
# View container resource usage
docker stats

# View specific container
docker stats google_auth_backend
```

## Security Considerations

### Production Checklist

- [ ] Use strong, unique SECRET_KEY
- [ ] Configure proper CORS_ORIGINS
- [ ] Use HTTPS (add reverse proxy like nginx/traefik)
- [ ] Use environment-specific secrets management
- [ ] Enable PostgreSQL SSL
- [ ] Implement rate limiting
- [ ] Add monitoring and logging
- [x] Use non-root users in Dockerfiles (implemented)
- [ ] Scan images for vulnerabilities
- [ ] Keep base images updated

### Environment Variables

Never commit `.env` files with real credentials. Always use:
- `.env.example` files for templates
- Secrets management systems (AWS Secrets Manager, HashiCorp Vault)
- CI/CD environment variables

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Production Build](https://react.dev/learn/start-a-new-react-project#production-grade-react-frameworks)

## Support

For issues or questions:
1. Check this guide first
2. Review logs: `docker-compose logs`
3. Check main README.md for application setup
4. Open an issue on GitHub
