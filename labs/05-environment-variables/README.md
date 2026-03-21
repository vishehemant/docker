# Lab 05: Environment Variables

## Objective

Learn how to pass configuration into containers using environment variables, `.env` files, and the `ARG` / `ENV` instructions in Dockerfiles.

## Prerequisites

- Docker Engine installed and running

---

## Part 1: Passing Environment Variables at Runtime

### Step 1 — Using the `-e` flag

```bash
docker run --rm -e MY_VAR="hello" alpine printenv MY_VAR
```

Output: `hello`

### Step 2 — Multiple variables

```bash
docker run --rm \
  -e APP_NAME="Docker Lab" \
  -e APP_ENV="development" \
  -e APP_DEBUG="true" \
  alpine printenv
```

### Step 3 — Pass host environment variables

```bash
export HOST_USER=$(whoami)
docker run --rm -e HOST_USER alpine printenv HOST_USER
```

When you use `-e VAR_NAME` without `=value`, Docker passes the variable's value from the host.

---

## Part 2: Using .env Files

### Step 1 — Examine the `.env` file

An `.env` file is provided in this directory:

```bash
cat .env
```

### Step 2 — Run with the env file

```bash
docker run --rm --env-file .env alpine printenv
```

All variables from the file are loaded into the container.

### Step 3 — Override specific values

```bash
docker run --rm --env-file .env -e APP_ENV=production alpine printenv APP_ENV
```

The `-e` flag overrides values from the env file.

---

## Part 3: ENV in Dockerfile

### Step 1 — Build the sample app

```bash
docker build -t lab05-env .
```

### Step 2 — Run with default values

```bash
docker run --rm lab05-env
```

The app uses the default values set in the Dockerfile with `ENV`.

### Step 3 — Override at runtime

```bash
docker run --rm -e APP_COLOR=green -e APP_TITLE="Custom Title" lab05-env
```

Runtime `-e` values override Dockerfile `ENV` defaults.

---

## Part 4: ARG vs ENV

### Key Differences

| Feature | `ARG` | `ENV` |
|---------|-------|-------|
| Available during build | Yes | Yes |
| Available at runtime | No | Yes |
| Set via | `--build-arg` | `-e` flag |
| Persists in image | No | Yes |

### Step 1 — Build with a build argument

```bash
docker build --build-arg VERSION=2.0 -t lab05-env:v2 .
```

### Step 2 — Verify

```bash
docker run --rm lab05-env:v2
```

The `VERSION` build arg was used to set the `APP_VERSION` env var during build.

---

## Part 5: Secrets and Sensitive Variables

### Warning: Environment variables are visible!

```bash
docker run -d --name secret-demo -e DB_PASSWORD=supersecret alpine sleep 3600
docker inspect secret-demo --format '{{json .Config.Env}}'
```

**Environment variables are stored in plain text** in the image and container metadata. For sensitive data in production, use Docker secrets or a vault solution.

```bash
docker rm -f secret-demo
```

---

## Exercises

1. Create a container that reads `DATABASE_URL` from the environment and prints it.
2. Create an `.env` file with 5 variables and load it into a container.
3. Build an image with `ARG` and verify the arg is NOT available at runtime.
4. Override a Dockerfile `ENV` value at runtime and verify the override works.

---

## Key Takeaways

- Use `-e KEY=VALUE` to pass environment variables at runtime.
- Use `--env-file` to load variables from a file.
- `ENV` in a Dockerfile sets default values available at runtime.
- `ARG` is only available during build — not at runtime.
- Runtime `-e` values override Dockerfile `ENV` defaults.
- **Never store secrets in environment variables** in production — use Docker secrets or a vault.
