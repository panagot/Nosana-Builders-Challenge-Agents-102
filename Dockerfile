# syntax=docker/dockerfile:1

FROM node:lts AS build

# Disable Analytics/Telemetry
ENV DISABLE_TELEMETRY=true
ENV POSTHOG_DISABLED=true
ENV MASTRA_TELEMETRY_DISABLED=true
ENV DO_NOT_TRACK=1

# Ensure logs are visible (disable buffering)
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev) for build
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

FROM node:lts AS runtime

RUN groupadd -g 1001 appgroup && \
  useradd -u 1001 -g appgroup -m -d /app -s /bin/false appuser

WORKDIR /app

# Copy built application
COPY --from=build --chown=appuser:appgroup /app ./

# Set environment variables
ENV NODE_ENV=production \
  NODE_OPTIONS="--enable-source-maps"

# Switch to non-root user
USER appuser

# Expose ports
EXPOSE 3000
EXPOSE 4111

# Start the application
ENTRYPOINT ["npm", "start"]