# Docker Fundamentals Lab

A comprehensive, hands-on lab series for learning Docker from the ground up. Each lab builds on the previous one, progressing from basic concepts to production-ready practices.

---

## Prerequisites

- **Docker Engine** (v20.10 or later) installed and running
- **Docker Compose** (v2) — included with Docker Desktop, or install the `docker-compose-plugin`
- A terminal / command-line environment
- Basic familiarity with the command line

### Verify your setup

```bash
docker --version
docker compose version
```

---

## Lab Overview

| # | Lab | What You'll Learn |
|---|-----|-------------------|
| 01 | [Images and Layers](labs/01-images-and-layers/) | How Docker images are built from layers, layer caching, and cache invalidation |
| 02 | [Container Lifecycle](labs/02-container-lifecycle/) | Creating, starting, stopping, inspecting, and removing containers |
| 03 | [Port Binding](labs/03-port-binding/) | Mapping container ports to the host, `EXPOSE` vs `-p`, port conflicts |
| 04 | [Volumes and Mounts](labs/04-volumes-and-mounts/) | Named volumes, bind mounts, tmpfs mounts, and data persistence |
| 05 | [Environment Variables](labs/05-environment-variables/) | Passing config with `-e`, `.env` files, `ARG` vs `ENV` |
| 06 | [Networking](labs/06-networking/) | Bridge networks, DNS resolution, network isolation, host/none modes |
| 07 | [Docker Compose](labs/07-docker-compose/) | Multi-container apps, services, networks, volumes, dependency management |
| 08 | [Multi-Stage Builds](labs/08-multi-stage-builds/) | Reducing image size by separating build and runtime stages |
| 09 | [Dockerfile Best Practices](labs/09-dockerfile-best-practices/) | Security, caching, `.dockerignore`, non-root users, health checks |

---

## Getting Started

### 1. Clone this repository

```bash
git clone <repository-url>
cd docker-fundamentals-lab
```

### 2. Start with Lab 01

```bash
cd labs/01-images-and-layers
```

Each lab has its own `README.md` with step-by-step instructions, explanations, and exercises.

### 3. Follow the labs in order

The labs are designed to be completed sequentially. Each one introduces concepts that later labs build upon.

---

## Repository Structure

```
.
├── README.md                              # This file
└── labs/
    ├── 01-images-and-layers/              # Docker images, layers, caching
    │   ├── README.md
    │   ├── Dockerfile
    │   └── index.html
    ├── 02-container-lifecycle/            # Container states and management
    │   └── README.md
    ├── 03-port-binding/                   # Port mapping and publishing
    │   ├── README.md
    │   ├── Dockerfile
    │   ├── package.json
    │   └── server.js
    ├── 04-volumes-and-mounts/             # Data persistence
    │   ├── README.md
    │   └── html/
    │       └── index.html
    ├── 05-environment-variables/          # Configuration management
    │   ├── README.md
    │   ├── .env
    │   ├── Dockerfile
    │   └── app.js
    ├── 06-networking/                     # Container networking
    │   └── README.md
    ├── 07-docker-compose/                 # Multi-container orchestration
    │   ├── README.md
    │   ├── docker-compose.yml
    │   ├── Dockerfile
    │   ├── package.json
    │   └── server.js
    ├── 08-multi-stage-builds/             # Build optimization
    │   ├── README.md
    │   ├── main.go
    │   ├── go.mod
    │   ├── Dockerfile.single
    │   ├── Dockerfile.multi
    │   └── Dockerfile.test
    └── 09-dockerfile-best-practices/      # Production best practices
        ├── README.md
        ├── .dockerignore
        ├── Dockerfile.bad
        ├── Dockerfile.good
        ├── package.json
        └── server.js
```

---

## Core Concepts Covered

### Docker Images and Layers
- Images are composed of stacked, read-only layers
- Each `RUN`, `COPY`, or `ADD` instruction creates a new layer
- Docker caches layers — changing a layer invalidates all subsequent layers
- Ordering instructions from least-changed to most-changed optimizes build speed

### Container Lifecycle
- `docker run` = `docker create` + `docker start`
- Containers can be: Created, Running, Paused, Stopped, Dead
- `docker exec` runs commands inside a running container
- `--rm` auto-removes the container on exit

### Port Binding
- `EXPOSE` in a Dockerfile is documentation only
- `-p HOST:CONTAINER` creates actual port mappings
- `-P` publishes all exposed ports to random host ports
- Each host port can only be bound to one container at a time

### Volumes and Mounts
- Container filesystems are ephemeral
- **Named volumes** — managed by Docker, persist independently
- **Bind mounts** — map host directories, ideal for development
- **tmpfs mounts** — in-memory only, ideal for secrets
- Use `:ro` for read-only access

### Environment Variables
- `-e KEY=VALUE` passes variables at runtime
- `--env-file` loads from a file
- `ENV` in Dockerfile sets defaults (overridable at runtime)
- `ARG` is build-time only — not available at runtime

### Networking
- Default bridge lacks DNS resolution between containers
- User-defined bridges provide automatic DNS by container name
- Containers on different networks are isolated
- Host mode shares the host's network stack

### Docker Compose
- Defines multi-container apps in a single YAML file
- `docker compose up -d` starts everything
- `docker compose down -v` removes everything including volumes
- `depends_on` with health checks manages startup order

### Multi-Stage Builds
- Separate build and runtime environments
- Only the final stage becomes the output image
- `COPY --from=stage` copies artifacts between stages
- Results in dramatically smaller production images

### Dockerfile Best Practices
- Pin base image versions
- Use Alpine or distroless variants
- Order instructions for optimal caching
- Use `.dockerignore`
- Run as non-root user
- Add health checks

---

## Quick Reference — Essential Docker Commands

### Images
```bash
docker pull <image>              # Download an image
docker build -t <name> .         # Build from Dockerfile
docker images                    # List local images
docker rmi <image>               # Remove an image
docker history <image>           # Show layer history
```

### Containers
```bash
docker run -d --name <n> <img>   # Run in background
docker ps                        # List running containers
docker ps -a                     # List all containers
docker stop <container>          # Stop gracefully
docker rm <container>            # Remove a container
docker logs <container>          # View logs
docker exec -it <c> /bin/sh      # Shell into container
```

### Volumes
```bash
docker volume create <name>      # Create a volume
docker volume ls                 # List volumes
docker volume inspect <name>     # Inspect a volume
docker volume rm <name>          # Remove a volume
docker volume prune              # Remove unused volumes
```

### Networks
```bash
docker network create <name>     # Create a network
docker network ls                # List networks
docker network inspect <name>    # Inspect a network
docker network connect <n> <c>   # Connect container to network
docker network rm <name>         # Remove a network
```

### Docker Compose
```bash
docker compose up -d             # Start services
docker compose down              # Stop and remove
docker compose ps                # List services
docker compose logs              # View logs
docker compose build             # Build images
docker compose exec <svc> sh     # Shell into service
```

### System
```bash
docker system df                 # Disk usage
docker system prune              # Clean up everything
docker info                      # System-wide info
```

---

## Cleanup

To remove all lab-related resources after completing the labs:

```bash
# Stop and remove all containers
docker rm -f $(docker ps -aq) 2>/dev/null

# Remove lab images
docker images --format '{{.Repository}}:{{.Tag}}' | grep lab | xargs docker rmi 2>/dev/null

# Remove unused volumes
docker volume prune -f

# Remove unused networks
docker network prune -f

# Nuclear option — remove everything unused
docker system prune -af --volumes
```

---

## License

This lab is provided for educational purposes. Feel free to use, modify, and share.
