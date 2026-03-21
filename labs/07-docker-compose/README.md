# Lab 07: Docker Compose

## Objective

Learn how to define and run multi-container applications using Docker Compose. Understand services, networks, volumes, and dependency management in a `docker-compose.yml` file.

## Prerequisites

- Docker Engine and Docker Compose installed
- (`docker compose` plugin or standalone `docker-compose`)

---

## Part 1: Your First Compose File

### Step 1 — Examine the compose file

Look at the `docker-compose.yml` file in this directory. It defines:
- A **web** service (Node.js app)
- A **db** service (PostgreSQL)
- A **redis** service (Redis cache)
- A custom network
- A named volume for database persistence

### Step 2 — Start all services

```bash
docker compose up -d
```

This builds images (if needed), creates networks, volumes, and starts all containers.

### Step 3 — Check running services

```bash
docker compose ps
```

### Step 4 — View logs

```bash
docker compose logs
docker compose logs web      # Logs for a specific service
docker compose logs -f web   # Follow logs
```

### Step 5 — Test the application

```bash
curl http://localhost:3000
curl http://localhost:3000/health
```

---

## Part 2: Compose Commands

### Scale a service

```bash
docker compose up -d --scale web=3
```

### Stop services (keep containers)

```bash
docker compose stop
```

### Start stopped services

```bash
docker compose start
```

### Restart services

```bash
docker compose restart
```

### Stop and remove everything

```bash
docker compose down
```

### Remove everything including volumes

```bash
docker compose down -v
```

---

## Part 3: Understanding the Compose File

### Services

Each service definition creates one or more containers:

```yaml
services:
  web:
    build: .           # Build from Dockerfile in current directory
    ports:
      - "3000:3000"    # Port mapping
    environment:       # Environment variables
      - NODE_ENV=development
    depends_on:        # Start order
      - db
      - redis
```

### Networks

Compose creates a default network automatically, but you can define custom ones:

```yaml
networks:
  app-network:
    driver: bridge
```

### Volumes

Named volumes persist data:

```yaml
volumes:
  db-data:
```

### depends_on

Controls startup order (but does NOT wait for the service to be "ready"):

```yaml
depends_on:
  db:
    condition: service_healthy   # Wait for health check
```

---

## Part 4: Build and Rebuild

### Build images

```bash
docker compose build
```

### Rebuild without cache

```bash
docker compose build --no-cache
```

### Build and start

```bash
docker compose up -d --build
```

---

## Part 5: Environment Variables in Compose

### Inline values

```yaml
environment:
  - APP_ENV=production
```

### From an env file

```yaml
env_file:
  - .env
```

### Variable substitution

```yaml
services:
  web:
    image: "myapp:${APP_VERSION:-latest}"
```

---

## Cleanup

```bash
docker compose down -v
```

---

## Exercises

1. Add a new service (e.g., Adminer for database management) to the compose file.
2. Use `docker compose exec db psql -U postgres` to connect to the database.
3. Scale the web service to 3 replicas and observe the container names.
4. Add a health check to the web service in the compose file.
5. Use `docker compose config` to validate and view the resolved compose file.

---

## Key Takeaways

- Docker Compose defines multi-container applications in a single YAML file.
- `docker compose up -d` starts all services in the background.
- `docker compose down` stops and removes containers, networks (add `-v` for volumes).
- **Services** define containers, **networks** define connectivity, **volumes** define persistence.
- `depends_on` controls startup order; use health checks for readiness.
- Compose automatically creates a network so services can reach each other by name.
