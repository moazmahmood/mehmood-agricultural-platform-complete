# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies for both client and server
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production && \
    cd server && npm ci --only=production && \
    cd ../client && npm ci --only=production

# Build the client
FROM base AS client-builder
WORKDIR /app/client

# Copy client files
COPY client/ .
COPY --from=deps /app/client/node_modules ./node_modules

# Build client for production
RUN npm run build

# Production image
FROM node:18-alpine AS production
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S agricultural -u 1001

# Copy server dependencies
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy server code
COPY server/ ./server/

# Copy built client
COPY --from=client-builder /app/client/build ./client/build

# Copy root package.json
COPY package*.json ./

# Set ownership
RUN chown -R agricultural:nodejs /app
USER agricultural

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node server/healthcheck.js

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "server:start"]