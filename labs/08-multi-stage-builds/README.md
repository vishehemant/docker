# Lab 08: Multi-Stage Builds

## Objective

Learn how to use multi-stage builds to create smaller, more secure production images by separating the build environment from the runtime environment.

## Prerequisites

- Docker Engine installed and running

---

## Part 1: The Problem — Large Images

### Step 1 — Build with a single-stage Dockerfile

```bash
docker build -f Dockerfile.single -t lab08-single .
```

### Step 2 — Check the image size

```bash
docker images lab08-single
```

The image includes the entire Go toolchain, source code, and build artifacts — things we don't need at runtime.

---

## Part 2: Multi-Stage Solution

### Step 1 — Build with a multi-stage Dockerfile

```bash
docker build -f Dockerfile.multi -t lab08-multi .
```

### Step 2 — Compare sizes

```bash
docker images | grep lab08
```

The multi-stage image is **dramatically smaller** because the final stage only contains the compiled binary and a minimal base image.

### Step 3 — Run both versions

```bash
docker run --rm -p 8080:8080 lab08-single &
curl http://localhost:8080
docker stop $(docker ps -q --filter ancestor=lab08-single)

docker run --rm -p 8080:8080 lab08-multi &
curl http://localhost:8080
docker stop $(docker ps -q --filter ancestor=lab08-multi)
```

Both produce identical output — the app works the same way.

---

## Part 3: Understanding the Multi-Stage Dockerfile

```dockerfile
# Stage 1: Build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o server .

# Stage 2: Runtime
FROM alpine:3.19
COPY --from=builder /app/server /server
CMD ["/server"]
```

Key concepts:
- `AS builder` names the build stage
- `COPY --from=builder` copies artifacts from the build stage into the final image
- Only the **final stage** becomes the output image
- Build tools, source code, and intermediate files are discarded

---

## Part 4: Building Specific Stages

### Build only the builder stage

```bash
docker build -f Dockerfile.multi --target builder -t lab08-builder .
```

Useful for debugging build issues or running tests in the build stage.

---

## Part 5: Multi-Stage with Testing

See `Dockerfile.test` which adds a test stage:

```bash
docker build -f Dockerfile.test --target test -t lab08-test .
docker run --rm lab08-test
```

This runs tests in an isolated build stage without including test dependencies in the final image.

---

## Cleanup

```bash
docker rmi lab08-single lab08-multi lab08-builder lab08-test 2>/dev/null
```

---

## Exercises

1. Compare the sizes of `lab08-single` and `lab08-multi`.
2. Add a test stage to the multi-stage Dockerfile.
3. Use `--target` to build only the builder stage and explore its contents.
4. Try using `scratch` instead of `alpine` as the final base image for an even smaller image.

---

## Key Takeaways

- Multi-stage builds produce **smaller, more secure** images.
- Use `AS name` to name build stages and `COPY --from=name` to copy artifacts.
- Only the **final stage** contributes to the output image.
- Build tools, source code, and test dependencies are not included in the production image.
- Use `--target` to build specific stages for debugging or testing.
- Smaller images = faster pulls, smaller attack surface, and less disk usage.
