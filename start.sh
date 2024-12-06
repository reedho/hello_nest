#!/bin/sh

# Wait for dependencies if needed
# while ! nc -z db 5432; do sleep 1; done

# Start PM2 with no daemon (important for Docker)
pm2-runtime start ecosystem.config.js
