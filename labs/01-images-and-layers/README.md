# Lab 01: Docker Images and Layers

## Objective

Understand how Docker images are built from layers, how caching works, and how to inspect image internals.

## Prerequisites

- Docker Engine installed and running
- Terminal / command-line access

---

## Part 1: Pulling and Inspecting Images

### Step 1 — Pull an image from Docker Hub

```bash
docker pull nginx:alpine
```

### Step 2 — List local images

```bash
docker images
```

You should see the `nginx:alpine` image along with its size, tag, and image ID.

### Step 3 — Inspect the image

```bash
docker inspect nginx:alpine
```

Look for:
- `RootFS.Layers` — shows how many layers make up the image
- `Config.Cmd` — the default command
- `Config.ExposedPorts` — ports the image declares

### Step 4 — View the image history (layers)

```bash
docker history nginx:alpine
```

Each row represents a layer. Notice how some layers have a size of `0B` — these are metadata-only instructions like `CMD` or `EXPOSE`.

---

## Part 2: Building an Image and Understanding Layers

### Step 1 — Build the sample image

From this directory, run:

```bash
docker build -t lab01-layers:v1 .
```

### Step 2 — Examine the layers

```bash
docker history lab01-layers:v1
```

Each `RUN`, `COPY`, and `ADD` instruction creates a new layer. `ENV`, `EXPOSE`, `CMD`, and `LABEL` instructions create metadata-only layers.

### Step 3 — Rebuild and observe caching

Run the build again without changes:

```bash
docker build -t lab01-layers:v1 .
```

Notice the `CACHED` messages — Docker reuses layers that haven't changed.

### Step 4 — Invalidate the cache

Edit `index.html` (change the heading text), then rebuild:

```bash
docker build -t lab01-layers:v2 .
```

Notice that layers *after* the changed `COPY` instruction are rebuilt, but layers *before* it are still cached. This is the **layer cache invalidation** rule.

---

## Part 3: Layer Size Analysis

### Step 1 — Check image sizes

```bash
docker images | grep lab01
```

### Step 2 — Use `docker system df` to see disk usage

```bash
docker system df
docker system df -v
```

### Step 3 — Understand shared layers

Pull two related images and compare:

```bash
docker pull node:20-alpine
docker pull node:18-alpine
docker system df -v
```

Notice how shared base layers reduce total disk usage.

---

## Exercises

1. Modify the `Dockerfile` to add another `RUN` layer. Rebuild and inspect how the history changes.
2. Reorder the `COPY` and `RUN` instructions. How does this affect caching when you change `index.html`?
3. Use `docker image inspect lab01-layers:v1 --format '{{.RootFS.Layers}}'` to list layer digests.

---

## Key Takeaways

- Docker images are composed of **read-only layers** stacked on top of each other.
- Each `RUN`, `COPY`, or `ADD` instruction in a Dockerfile creates a new layer.
- Docker uses a **layer cache** — unchanged layers are reused from cache.
- Changing a layer **invalidates all subsequent layers** in the cache.
- Ordering instructions from least-frequently-changed to most-frequently-changed optimizes build speed.
