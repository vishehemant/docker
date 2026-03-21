# Lab 09: Dockerfile Best Practices

## Objective

Learn practical Dockerfile best practices that reduce image size, improve build speed, and enhance security.

## Prerequisites

- Docker Engine installed and running

---

## Practice 1: Use Specific Base Image Tags

### Bad

```dockerfile
FROM node:latest
```

### Good

```dockerfile
FROM node:20-alpine
```

**Why:** `latest` is unpredictable. Pinning a specific version ensures reproducible builds. Alpine variants are smaller.

---

## Practice 2: Leverage Build Cache — Order Matters

### Bad (cache-busting on every code change)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

### Good (dependencies cached separately)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY . .
CMD ["node", "server.js"]
```

**Why:** `package.json` changes less often than source code. Copying it first means `npm install` is cached unless dependencies actually change.

---

## Practice 3: Combine RUN Commands

### Bad (creates 3 layers)

```dockerfile
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*
```

### Good (single layer, smaller image)

```dockerfile
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*
```

**Why:** Each `RUN` creates a layer. Combining them and cleaning up in the same layer reduces image size.

---

## Practice 4: Use .dockerignore

See the `.dockerignore` file in this directory.

```bash
cat .dockerignore
```

**Why:** Prevents unnecessary files from being sent to the build context, speeding up builds and preventing secrets from leaking into images.

### Step 1 — Build without .dockerignore

```bash
mv .dockerignore .dockerignore.bak
docker build -t lab09-no-ignore .
mv .dockerignore.bak .dockerignore
```

### Step 2 — Build with .dockerignore

```bash
docker build -t lab09-with-ignore .
```

Compare the build context size in the output.

---

## Practice 5: Don't Run as Root

### Bad

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
CMD ["node", "server.js"]
```

### Good

```dockerfile
FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --chown=appuser:appgroup . .
USER appuser
CMD ["node", "server.js"]
```

**Why:** Running as root inside a container is a security risk. If the container is compromised, the attacker has root access.

---

## Practice 6: Use COPY Instead of ADD

### Bad

```dockerfile
ADD https://example.com/file.tar.gz /app/
ADD . /app/
```

### Good

```dockerfile
RUN wget -O /app/file.tar.gz https://example.com/file.tar.gz
COPY . /app/
```

**Why:** `ADD` has implicit behavior (auto-extraction, URL fetching) that can be surprising. `COPY` is explicit and predictable.

---

## Practice 7: Use Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
```

**Why:** Health checks let Docker (and orchestrators like Kubernetes) know if your app is actually healthy, not just running.

---

## Practice 8: Use Labels for Metadata

```dockerfile
LABEL maintainer="team@example.com"
LABEL version="1.0"
LABEL description="Production API server"
```

**Why:** Labels add searchable metadata to images without affecting size or behavior.

---

## Hands-On: Build and Compare

### Step 1 — Build the bad example

```bash
docker build -f Dockerfile.bad -t lab09-bad .
```

### Step 2 — Build the good example

```bash
docker build -f Dockerfile.good -t lab09-good .
```

### Step 3 — Compare

```bash
docker images | grep lab09
```

---

## Cleanup

```bash
docker rmi lab09-bad lab09-good lab09-no-ignore lab09-with-ignore 2>/dev/null
```

---

## Best Practices Checklist

- [ ] Use specific, pinned base image tags
- [ ] Use Alpine or distroless variants when possible
- [ ] Order Dockerfile instructions from least-changed to most-changed
- [ ] Combine `RUN` commands and clean up in the same layer
- [ ] Use `.dockerignore` to exclude unnecessary files
- [ ] Don't run as root — use `USER` instruction
- [ ] Prefer `COPY` over `ADD`
- [ ] Add `HEALTHCHECK` instructions
- [ ] Use multi-stage builds for compiled languages
- [ ] Add metadata with `LABEL` instructions
- [ ] Use `npm ci` instead of `npm install` for reproducible builds
- [ ] Scan images for vulnerabilities with `docker scout`

---

## Key Takeaways

- Small images are faster to pull, use less disk, and have fewer vulnerabilities.
- Layer ordering and caching dramatically affect build speed.
- Security best practices (non-root user, minimal base) reduce risk.
- `.dockerignore` prevents secrets and unnecessary files from entering the build.
