# Lab 02: Container Lifecycle

## Objective

Learn how to create, start, stop, restart, pause, and remove containers. Understand the difference between `docker run`, `docker create`, and `docker start`.

## Prerequisites

- Docker Engine installed and running

---

## Part 1: Running Containers

### Step 1 — Run a container in the foreground

```bash
docker run --name lifecycle-fg alpine echo "Hello from Alpine!"
```

The container runs, prints the message, and exits.

### Step 2 — Run a container in the background (detached mode)

```bash
docker run -d --name lifecycle-bg nginx:alpine
```

The `-d` flag runs the container in the background. Docker prints the container ID.

### Step 3 — List running containers

```bash
docker ps
```

### Step 4 — List all containers (including stopped)

```bash
docker ps -a
```

Notice `lifecycle-fg` has status `Exited` while `lifecycle-bg` is `Up`.

---

## Part 2: Container States

### Step 1 — Stop a running container

```bash
docker stop lifecycle-bg
```

Docker sends `SIGTERM`, waits 10 seconds (grace period), then sends `SIGKILL`.

### Step 2 — Start a stopped container

```bash
docker start lifecycle-bg
```

### Step 3 — Restart a container

```bash
docker restart lifecycle-bg
```

### Step 4 — Pause and unpause

```bash
docker pause lifecycle-bg
docker ps   # Status shows "Paused"
docker unpause lifecycle-bg
```

Pausing freezes all processes using cgroups without stopping the container.

---

## Part 3: Interacting with Containers

### Step 1 — Attach to a running container

```bash
docker attach lifecycle-bg
```

Press `Ctrl+C` to detach (this may stop the container). Use `Ctrl+P Ctrl+Q` to detach without stopping.

### Step 2 — Execute a command inside a running container

```bash
docker exec lifecycle-bg cat /etc/os-release
```

### Step 3 — Open an interactive shell

```bash
docker exec -it lifecycle-bg /bin/sh
```

Inside the container, try:

```bash
ls /usr/share/nginx/html/
hostname
exit
```

### Step 4 — View container logs

```bash
docker logs lifecycle-bg
docker logs -f lifecycle-bg     # Follow (stream) logs
docker logs --tail 5 lifecycle-bg  # Last 5 lines
```

---

## Part 4: Inspecting and Removing Containers

### Step 1 — Inspect container details

```bash
docker inspect lifecycle-bg
```

Useful fields:
- `State.Status` — current state
- `NetworkSettings.IPAddress` — container IP
- `Mounts` — attached volumes

### Step 2 — View resource usage

```bash
docker stats lifecycle-bg --no-stream
```

### Step 3 — Remove a stopped container

```bash
docker stop lifecycle-bg
docker rm lifecycle-bg
docker rm lifecycle-fg
```

### Step 4 — Force-remove a running container

```bash
docker run -d --name temp-container nginx:alpine
docker rm -f temp-container
```

### Step 5 — Run with auto-remove

```bash
docker run --rm alpine echo "I will be removed automatically"
docker ps -a  # The container is gone
```

---

## Part 5: Using `docker create` vs `docker run`

### Step 1 — Create a container without starting it

```bash
docker create --name created-only alpine echo "Created but not started"
docker ps -a  # Status: "Created"
```

### Step 2 — Start the created container

```bash
docker start -a created-only
```

The `-a` flag attaches stdout/stderr so you can see the output.

---

## Exercises

1. Run an Nginx container, then use `docker exec` to create a custom HTML file inside it.
2. Run `docker top <container>` to see the processes inside a running container.
3. Use `docker diff <container>` to see filesystem changes made inside a container.
4. Experiment with `docker wait <container>` to wait for a container to stop and return its exit code.

---

## Key Takeaways

- `docker run` = `docker create` + `docker start`.
- Containers can be in states: **Created**, **Running**, **Paused**, **Stopped** (Exited), **Dead**.
- `docker exec` runs new processes inside a running container.
- The `--rm` flag automatically removes the container when it exits.
- `docker logs` retrieves stdout/stderr output from a container.
- Stopped containers still occupy disk space until removed.
