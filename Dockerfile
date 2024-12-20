# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

# Install dumb-init
RUN apk add --no-cache dumb-init

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY ecosystem.config.js ./
COPY start.sh ./

# Install production dependencies only
RUN npm ci --only=production --omit=dev

# Make start script executable
RUN chmod +x start.sh

# Set user for better security
USER node

ENV NODE_ENV=production
ENV PORT=3000

# Use dumb-init as the entry point
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Use PM2 Runtime as the command
CMD ["./start.sh"]
