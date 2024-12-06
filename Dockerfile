# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY ecosystem.config.js ./
COPY start.sh ./

# Install production dependencies only
RUN npm ci --only=production

# Make start script executable
RUN chmod +x start.sh

# Set user for better security
USER node

ENV NODE_ENV=production
ENV PORT=3000

# Use PM2 Runtime
CMD ["./start.sh"]
