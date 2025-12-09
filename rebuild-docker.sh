#!/bin/bash

# Script to rebuild Docker containers from scratch

echo "🔄 Rebuilding Docker containers..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop first."
    exit 1
fi

COMPOSE_FLAGS="-f docker-compose.yml"
echo "🔧 Using development configuration (docker-compose.yml)..."

# Stop and remove containers, networks, and volumes
echo "🛑 Stopping and removing containers, networks, and volumes..."
docker compose $COMPOSE_FLAGS down -v

# Rebuild containers without cache
echo "🔨 Rebuilding containers without cache..."
docker compose $COMPOSE_FLAGS build --no-cache

# Start containers
echo "🚀 Starting containers..."
docker compose $COMPOSE_FLAGS up -d

# Show container status
echo ""
echo "✅ Containers rebuilt! Status:"
docker compose $COMPOSE_FLAGS ps

echo ""
echo "🔄 Running database migrations..."
# Wait a few seconds for DB to be ready
sleep 5
docker compose $COMPOSE_FLAGS exec backend alembic upgrade head
echo "✅ Database migrations applied!"

echo ""
echo "📝 To view logs, run: docker compose $COMPOSE_FLAGS logs -f"

