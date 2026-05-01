# ── Stage 1: Build Node.js backend ──────────────────────
FROM node:18-alpine AS backend-build

WORKDIR /app/backend

# Copy package files and install production deps only
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY backend/ ./

# ── Stage 2: Final image with nginx + node ──────────────
FROM node:18-alpine

# Install nginx
RUN apk add --no-cache nginx

# Copy backend from build stage
WORKDIR /app/backend
COPY --from=backend-build /app/backend ./

# Copy frontend static files
COPY frontend/ /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (nginx) — backend listens on 3000 internally
EXPOSE 80

# Start nginx and Node.js backend together
CMD sh -c "node /app/backend/app.js & nginx -g 'daemon off;'"
