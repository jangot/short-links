#!/bin/bash

echo "=========================================="
echo "    Starting Short Links Project"
echo "=========================================="

if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running."
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✓ Docker is running"

echo ""
echo "Stopping existing containers..."
docker-compose down

# Собираем и запускаем проект
echo ""
echo "Building and starting project..."
docker-compose up --build -d

echo ""
echo "Waiting for services to start..."
sleep 10

echo ""
echo "Container status:"
echo "------------------------------------------"
docker-compose ps

echo ""
echo "=========================================="
echo "    Project started successfully!"
echo "=========================================="
echo ""
echo "Available services:"
echo "  • Frontend:     http://localhost:3000"
echo "  • Backend API:  http://localhost:3001"
echo "  • PostgreSQL:   localhost:5432"
echo ""
echo "Useful commands:"
echo "  • View logs:        docker-compose logs -f"
echo "  • Stop services:    docker-compose down"
echo "=========================================="
