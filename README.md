# Short Links - URL Shortener Service

A full-stack application for creating and managing short links with NestJS backend, React frontend, and PostgreSQL database.

1. **Clone the repository:**
   ```bash
   git clone git@github.com:jangot/short-links.git
   cd short-links
   ```

2. **Simple start the project:**
   ```bash
   ./start.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Technologies

- **Backend**: NestJS, TypeScript, TypeORM
- **Frontend**: React, TypeScript
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up --build
```
