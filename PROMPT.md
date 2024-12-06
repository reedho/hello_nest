# Prompt

## Problem

The application is not shutting down gracefully when the container is stopped.

## Solution

Key changes made:

1. Added dumb-init installation using Alpine's package manager (apk add --no-cache dumb-init)
2. Added ENTRYPOINT directive to use dumb-init as the container's init process
3. Kept PM2 as the process manager but now running under dumb-init

Benefits of this change:

- Proper signal handling: dumb-init will properly forward signals to the child processes
- Zombie process reaping: Any zombie processes will be properly cleaned up
- Clean shutdowns: The application will shut down gracefully when the container is stopped
- Compatible with both PM2 and Node.js processes
- Minimal overhead: dumb-init is very lightweight

This setup gives you the best of both worlds - PM2's process management capabilities and dumb-init's proper init system behavior in a containerized environment.
