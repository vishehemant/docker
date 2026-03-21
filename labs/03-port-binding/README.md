# Lab 03: Port Binding

## Objective

Learn how to expose container ports to the host machine, map specific ports, and understand the difference between `EXPOSE` and `-p`.

## Prerequisites

- Docker Engine installed and running

---

## Part 1: Understanding EXPOSE vs Publish

### Key Concepts

| Feature | `EXPOSE` in Dockerfile | `-p` / `--publish` flag |
|---------|----------------------|------------------------|
| Purpose | Documentation only | Actually maps the port |
| Effect  | No port binding | Creates host ↔ container mapping |
| Required for access? | No | Yes |

`EXPOSE` is metadata — it tells users which ports the app listens on. The `-p` flag actually creates the port mapping.

---

## Part 2: Basic Port Mapping

### Step 1 — Build the sample app

```bash
docker build -t lab03-ports .
```

### Step 2 — Run with explicit port mapping

```bash
docker run -d --name ports-explicit -p 8080:3000 lab03-ports
```

This maps **host port 8080** → **container port 3000**.

### Step 3 — Test the connection

```bash
curl http://localhost:8080
```

### Step 4 — Check port mappings

```bash
docker port ports-explicit
```

Output: `3000/tcp -> 0.0.0.0:8080`

---

## Part 3: Port Mapping Variations

### Random host port

Let Docker choose an available host port:

```bash
docker run -d --name ports-random -p 3000 lab03-ports
docker port ports-random
```

### Bind to specific interface

Bind only to localhost (not accessible from other machines):

```bash
docker run -d --name ports-localhost -p 127.0.0.1:8081:3000 lab03-ports
```

### Map UDP ports

```bash
docker run -d --name ports-udp -p 5000:5000/udp some-udp-app
```

### Multiple port mappings

```bash
docker run -d --name ports-multi \
  -p 8080:3000 \
  -p 8443:3000 \
  lab03-ports
```

### Publish all exposed ports (`-P`)

```bash
docker run -d --name ports-all -P lab03-ports
docker port ports-all
```

Docker automatically maps all `EXPOSE`d ports to random high-numbered host ports.

---

## Part 4: Port Conflict Resolution

### Step 1 — Try to bind the same host port twice

```bash
docker run -d --name ports-a -p 9090:3000 lab03-ports
docker run -d --name ports-b -p 9090:3000 lab03-ports
```

The second command **fails** because host port 9090 is already in use.

### Step 2 — Use different host ports for the same container port

```bash
docker run -d --name ports-b -p 9091:3000 lab03-ports
```

---

## Part 5: Inspecting Port Configuration

```bash
docker inspect ports-explicit --format '{{json .NetworkSettings.Ports}}' | python3 -m json.tool
```

---

## Cleanup

```bash
docker rm -f ports-explicit ports-random ports-localhost ports-multi ports-all ports-a ports-b 2>/dev/null
```

---

## Exercises

1. Run two instances of the app on different host ports and verify both respond.
2. Run the app with `-P` and find which random port was assigned.
3. Try binding to `0.0.0.0` explicitly and compare with the default behavior.
4. Use `docker inspect` to find the port configuration of a running container.

---

## Key Takeaways

- `EXPOSE` in a Dockerfile is **documentation only** — it does not publish the port.
- Use `-p HOST:CONTAINER` to create an actual port mapping.
- Use `-p CONTAINER` to let Docker pick a random host port.
- Use `-P` to publish all `EXPOSE`d ports to random host ports.
- Each host port can only be bound to **one container** at a time.
- Bind to `127.0.0.1` to restrict access to the local machine only.
