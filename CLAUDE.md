# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready e-commerce seckill (flash sale) system v1.3 built with a microservices architecture. The system consists of a Spring Boot backend, React admin panel, React client application, and complete Docker containerization. It implements distributed caching using Redis for handling high-concurrency product flash sales with comprehensive management functionality.

## Architecture Overview

The system follows a multi-tier architecture:

```
seckill/
├── seckill-backend/     # Spring Boot 3.5.6 main application
├── seckill-admin/      # React 18 + TypeScript admin panel
├── seckill-web/        # React 18 + TypeScript client application
├── docker-compose.yml  # Complete containerization setup
├── nginx/             # Nginx reverse proxy configuration
├── mysql/             # MySQL 8.0 configuration
├── redis/             # Redis 6.x configuration
└── docs/              # Comprehensive project documentation
```

## Environment Configuration

- **Java Version**: OpenJDK 25
- **Spring Boot**: 3.5.6
- **Node.js**: 16+ (for frontend applications)
- **MySQL**: 8.0 (port 3307 in Docker)
- **Redis**: 6.x (port 6380 in Docker)
- **Docker**: 20.0+ with Docker Compose 2.0+

## Development Commands

### Backend (Spring Boot)

```bash
# Navigate to backend directory
cd seckill-backend

# Compile the project
mvn compile

# Run tests
mvn test

# Run specific test class
mvn test -Dtest=AppTest

# Package the application
mvn package

# Clean build artifacts
mvn clean

# Full clean build and test
mvn clean compile test

# Run the application locally (requires local MySQL/Redis)
mvn spring-boot:run
```

### Admin Panel (React)

```bash
# Navigate to admin directory
cd seckill-admin

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Client Application (React)

```bash
# Navigate to web directory
cd seckill-web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Docker Deployment

```bash
# One-command deployment (recommended)
docker-compose up -d

# View service status
docker-compose ps

# View application logs
docker-compose logs -f seckill-app

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Project Structure

### Backend Structure (`seckill-backend/`)
```
src/main/java/com/example/
├── controller/        # REST API controllers
├── service/          # Business logic services
├── entity/           # JPA entities
├── dto/             # Data transfer objects
├── common/          # Utility classes
├── exception/        # Exception handling
├── config/          # Configuration classes
└── App.java         # Main application class

src/main/resources/
├── application.yml   # Application configuration
├── sql/             # Database initialization scripts
└── static/          # Static resources
```

### Frontend Structure (`seckill-admin/`, `seckill-web/`)
```
src/
├── components/      # Reusable UI components
├── pages/          # Page components
├── services/       # API service integration
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── styles/         # Global styles
```

## Key Features

### Backend (Spring Boot)
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations, inventory tracking
- **Seckill System**: Flash sales with Redis caching and concurrent control
- **Order Management**: Order creation, tracking, history
- **Distributed Caching**: Redis integration for performance
- **API Documentation**: SpringDoc OpenAPI 3 with Swagger UI
- **Health Monitoring**: Application health checks and metrics

### Admin Panel (React)
- **Authentication**: Admin login system
- **Dashboard**: System overview with statistics
- **User Management**: User listing and search
- **Product Management**: Product CRUD operations
- **Seckill Management**: Activity monitoring and control
- **Responsive Design**: Mobile-friendly interface

## Service Endpoints

### Docker Compose Services
- **Backend API**: http://localhost:8081
- **Admin Panel**: http://localhost:5173 (development)
- **API Documentation**: http://localhost:8081/swagger-ui.html
- **Health Check**: `curl -X POST http://localhost:8081/api/status`
- **Nginx Proxy**: http://localhost:8082

### Database Access
- **MySQL**: localhost:3307 (user: seckill_user, password: seckill_pass)
- **Redis**: localhost:6380

## Development Guidelines

### Backend Development
- Follow Spring Boot conventions and best practices
- Use JPA entities for database modeling
- Implement proper exception handling with `@ControllerAdvice`
- Use Redis for caching frequently accessed data
- Ensure thread safety for concurrent operations
- Write comprehensive unit tests for service layers

### Frontend Development
- Use TypeScript for type safety
- Follow React functional component patterns with hooks
- Implement proper error boundaries and loading states
- Use Tailwind CSS for consistent styling
- Ensure responsive design for mobile compatibility

### Performance Considerations
- The system is optimized for high-concurrency scenarios
- Redis caching reduces database load for read operations
- Atomic operations prevent race conditions in inventory management
- Connection pooling configured for optimal database performance
- Performance metrics: QPS 633-698, response time 30-67ms

## Testing

### Backend Testing
```bash
# Run all tests
mvn test

# Run integration tests
mvn verify

# Generate test coverage report
mvn jacoco:report
```

### Frontend Testing
```bash
# Run unit tests (when available)
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## Troubleshooting

### Common Issues
- **Port conflicts**: Ensure ports 3307, 6380, 8081, 8082 are available
- **Docker build failures**: Check network connectivity and proxy settings
- **Database connection**: Verify MySQL health check passes before app startup
- **Redis connection**: Ensure Redis container is running and accessible

### Debug Commands
```bash
# Check container logs
docker-compose logs [service-name]

# Debug database connection
docker exec -it seckill-mysql mysql -u seckill_user -p

# Debug Redis connection
docker exec -it seckill-redis redis-cli

# Restart specific service
docker-compose restart [service-name]
```

## Current Status

The project is in production-ready state v1.3 with complete functionality including:
- ✅ Full seckill system implementation
- ✅ Redis distributed caching
- ✅ Docker containerization
- ✅ Admin and client interfaces
- ✅ API documentation
- ✅ Performance optimization
- ✅ Error handling and logging
