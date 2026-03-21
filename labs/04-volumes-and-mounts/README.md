# Lab 04: Volumes and Mounts

## Objective

Learn how to persist data beyond a container's lifecycle using Docker volumes and bind mounts. Understand the difference between named volumes, anonymous volumes, and bind mounts.

## Prerequisites

- Docker Engine installed and running

---

## Part 1: The Problem — Data Loss Without Volumes

### Step 1 — Write data inside a container

```bash
docker run -it --name no-volume alpine /bin/sh -c "echo 'important data' > /data.txt && cat /data.txt"
```

### Step 2 — Remove and recreate

```bash
docker rm no-volume
docker run -it --name no-volume alpine cat /data.txt
```

The file is **gone**. Container filesystems are ephemeral — when the container is removed, the data is lost.

```bash
docker rm no-volume
```

---

## Part 2: Named Volumes

Named volumes are managed by Docker and persist independently of containers.

### Step 1 — Create a named volume

```bash
docker volume create lab04-data
```

### Step 2 — Inspect the volume

```bash
docker volume inspect lab04-data
```

Note the `Mountpoint` — this is where Docker stores the data on the host.

### Step 3 — Use the volume in a container

```bash
docker run -it --name writer -v lab04-data:/data alpine /bin/sh -c "echo 'persisted data' > /data/message.txt"
```

### Step 4 — Read from another container

```bash
docker run -it --name reader -v lab04-data:/data alpine cat /data/message.txt
```

The data persists because both containers mount the same named volume.

### Step 5 — Cleanup containers (volume remains)

```bash
docker rm writer reader
docker volume ls  # lab04-data still exists
```

---

## Part 3: Bind Mounts

Bind mounts map a **host directory** into the container.

### Step 1 — Create a host directory with content

From this lab directory:

```bash
docker run -d --name bind-demo \
  -v $(pwd)/html:/usr/share/nginx/html:ro \
  -p 8080:80 \
  nginx:alpine
```

### Step 2 — Test the mount

```bash
curl http://localhost:8080
```

You should see the content of `html/index.html`.

### Step 3 — Edit on the host, see changes instantly

Edit `html/index.html` on your host machine. Then:

```bash
curl http://localhost:8080
```

Changes appear immediately — no rebuild needed. This is why bind mounts are popular for development.

### Step 4 — Read-only mounts

The `:ro` flag makes the mount read-only inside the container:

```bash
docker exec bind-demo touch /usr/share/nginx/html/newfile.txt
```

This will **fail** because the mount is read-only.

---

## Part 4: Anonymous Volumes

### Step 1 — Run with an anonymous volume

```bash
docker run -d --name anon-vol -v /data alpine sleep 3600
```

### Step 2 — Find the anonymous volume

```bash
docker inspect anon-vol --format '{{json .Mounts}}' | python3 -m json.tool
```

Anonymous volumes get a random hash name and are harder to manage.

### Step 3 — Cleanup

```bash
docker rm -f anon-vol
docker volume prune  # Removes unused anonymous volumes
```

---

## Part 5: tmpfs Mounts (Memory-Only Storage)

For sensitive data that should never be written to disk:

```bash
docker run -d --name tmpfs-demo \
  --tmpfs /secrets:rw,size=64m \
  alpine sleep 3600

docker exec tmpfs-demo /bin/sh -c "echo 'secret' > /secrets/key.txt && cat /secrets/key.txt"
```

The `/secrets` directory exists only in memory and vanishes when the container stops.

```bash
docker rm -f tmpfs-demo
```

---

## Part 6: Volume Mount Comparison

| Feature | Named Volume | Bind Mount | tmpfs Mount |
|---------|-------------|------------|-------------|
| Managed by Docker | Yes | No | No |
| Location | Docker area | Anywhere on host | Memory only |
| Survives container removal | Yes | N/A (host files) | No |
| Shareable between containers | Yes | Yes | No |
| Works on all OS | Yes | Path format varies | Linux only |
| Best for | Production data | Development | Secrets/temp data |

---

## Cleanup

```bash
docker rm -f bind-demo 2>/dev/null
docker volume rm lab04-data 2>/dev/null
```

---

## Exercises

1. Create a named volume, write a file from one container, and read it from another.
2. Use a bind mount to serve a local HTML file with Nginx.
3. Try removing a volume that's in use by a container — what happens?
4. Use `docker volume prune` to clean up unused volumes.
5. Mount the same volume into two containers simultaneously and write from both.

---

## Key Takeaways

- Container filesystems are **ephemeral** — data is lost when the container is removed.
- **Named volumes** are the recommended way to persist data in production.
- **Bind mounts** map host directories into containers — ideal for development.
- **tmpfs mounts** store data in memory only — ideal for secrets.
- Use `:ro` to make mounts read-only inside the container.
- Volumes persist until explicitly removed with `docker volume rm`.
