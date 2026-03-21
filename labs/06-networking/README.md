# Lab 06: Docker Networking

## Objective

Understand Docker's networking model, including bridge networks, host networking, container DNS, and how containers communicate with each other.

## Prerequisites

- Docker Engine installed and running

---

## Part 1: Default Bridge Network

### Step 1 — List Docker networks

```bash
docker network ls
```

You'll see three default networks: `bridge`, `host`, and `none`.

### Step 2 — Inspect the default bridge network

```bash
docker network inspect bridge
```

### Step 3 — Run two containers on the default bridge

```bash
docker run -d --name net-a alpine sleep 3600
docker run -d --name net-b alpine sleep 3600
```

### Step 4 — Find their IP addresses

```bash
docker inspect net-a --format '{{.NetworkSettings.IPAddress}}'
docker inspect net-b --format '{{.NetworkSettings.IPAddress}}'
```

### Step 5 — Ping by IP (works)

```bash
docker exec net-a ping -c 2 $(docker inspect net-b --format '{{.NetworkSettings.IPAddress}}')
```

### Step 6 — Ping by name (fails on default bridge)

```bash
docker exec net-a ping -c 2 net-b
```

**This fails!** The default bridge network does not provide automatic DNS resolution between containers.

---

## Part 2: User-Defined Bridge Networks

### Step 1 — Create a custom network

```bash
docker network create lab-network
```

### Step 2 — Run containers on the custom network

```bash
docker run -d --name app --network lab-network alpine sleep 3600
docker run -d --name db --network lab-network alpine sleep 3600
```

### Step 3 — Ping by name (works!)

```bash
docker exec app ping -c 2 db
docker exec db ping -c 2 app
```

User-defined bridge networks provide **automatic DNS resolution** — containers can reach each other by name.

### Step 4 — Inspect the custom network

```bash
docker network inspect lab-network
```

---

## Part 3: Network Isolation

### Step 1 — Verify isolation between networks

```bash
docker exec net-a ping -c 2 app
```

**This fails!** Containers on different networks are isolated from each other.

### Step 2 — Connect a container to a second network

```bash
docker network connect lab-network net-a
docker exec net-a ping -c 2 app
```

Now `net-a` is connected to both `bridge` and `lab-network`.

### Step 3 — Disconnect from a network

```bash
docker network disconnect lab-network net-a
```

---

## Part 4: Host Network Mode

Host networking removes network isolation — the container shares the host's network stack.

```bash
docker run --rm --network host alpine ifconfig
```

With host networking:
- No port mapping needed (`-p` is ignored)
- Container binds directly to host ports
- Better performance, less isolation

---

## Part 5: None Network

Completely isolated — no networking at all:

```bash
docker run --rm --network none alpine ifconfig
```

Only the loopback (`lo`) interface is available.

---

## Part 6: Practical Example — App + Database

### Step 1 — Create an application network

```bash
docker network create app-tier
```

### Step 2 — Run a database container

```bash
docker run -d --name postgres \
  --network app-tier \
  -e POSTGRES_PASSWORD=labpassword \
  -e POSTGRES_DB=labdb \
  postgres:16-alpine
```

### Step 3 — Connect from an app container

```bash
docker run --rm --network app-tier postgres:16-alpine \
  psql -h postgres -U postgres -d labdb -c "SELECT 1 AS connected;"
```

The app reaches the database using the container name `postgres` as the hostname.

---

## Cleanup

```bash
docker rm -f net-a net-b app db postgres 2>/dev/null
docker network rm lab-network app-tier 2>/dev/null
```

---

## Exercises

1. Create two custom networks and verify that containers on different networks cannot communicate.
2. Connect a container to multiple networks and verify it can reach containers on both.
3. Run an Nginx container with `--network host` and access it without `-p`.
4. Use `docker network inspect` to list all containers attached to a network.

---

## Key Takeaways

- Docker has three default networks: `bridge`, `host`, and `none`.
- The default bridge does **not** support DNS resolution between containers.
- **User-defined bridge networks** provide automatic DNS resolution by container name.
- Containers on different networks are **isolated** from each other.
- Use `docker network connect/disconnect` to manage multi-network containers.
- **Host networking** shares the host's network stack (no isolation, no port mapping).
- Always use user-defined networks for multi-container applications.
