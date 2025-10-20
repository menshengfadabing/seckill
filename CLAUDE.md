# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Java-based e-commerce seckill (flash sale) system project for a course assignment. The system will implement distributed caching using Redis for handling high-concurrency product flash sales and coupon functionality.

## Environment Configuration

- **Java Version**: PS E:\Java_project\seckill> java -version
openjdk version "25" 2025-09-16 LTS
OpenJDK Runtime Environment Temurin-25+36 (build 25+36-LTS)
OpenJDK 64-Bit Server VM Temurin-25+36 (build 25+36-LTS, mixed mode, sharing)
- **Maven**: Standard Maven project structure
- **Redis**: Local instance running on port 6379
- **MySQL**: Local instance running on port 3306 with password `123456`
- **Framework Target**: Spring Boot 4.0.x (for implementation)

## Build and Test Commands

```bash
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
```

## Project Structure

```
seckill/
├── pom.xml                    # Maven configuration
├── src/
│   ├── main/java/com/example/
│   │   └── App.java          # Main application entry point (currently placeholder)
│   └── test/java/com/example/
│       └── AppTest.java      # Unit tests (currently placeholder)
├── docs/
│   └── 课设要求.md           # Course requirements documentation
└── base_env.md               # Environment setup instructions
```

## Implementation Requirements

Based on the course requirements in `docs/课设要求.md`, the system needs to implement:

1. **Redis Configuration**: Set up public access to Redis cache instance
2. **Product Query**: E-commerce product search and retrieval functionality
3. **Seckill Functionality**: Core flash sale system with high-concurrency handling
4. **Cloud Deployment**: Cloud-based deployment configuration

## Development Guidelines

- Use recent dependency versions (Spring Boot 4.0.x target)
- Implement distributed caching with Redis for handling concurrent seckill requests
- Design for high availability and performance under heavy load
- Follow standard Spring Boot project structure and conventions
- Ensure thread safety for inventory management and order processing

## Current State

The project is in initial setup phase with basic Maven structure. Core Spring Boot dependencies, Redis integration, and seckill business logic need to be implemented.