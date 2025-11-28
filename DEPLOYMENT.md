# Deployment Guide - Lobo Automotive Monorepo

## Dokploy Deployment

This monorepo contains both frontend and backend in a single Docker container using NGINX as a reverse proxy.

### Architecture

- **NGINX (Port 80)**: Serves frontend static files and proxies API requests
- **Node.js Backend (Port 5000)**: Handles API requests
- **Supervisor**: Manages both processes in a single container

### Deployment Steps

1. **In Dokploy, create a new application:**
   - Type: Docker
   - Build from: Dockerfile in root directory

2. **Set the following environment variables:**

   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:5432/database?schema=public

   # Node Environment
   NODE_ENV=production
   PORT=5000

   # CORS (your frontend domain)
   CORS_ORIGIN=https://yourdomain.com

   # Email (SMTP settings)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-password
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_TO=admin@yourdomain.com

   # Build Args (optional, defaults are set)
   VITE_API_BASE_URL=/api
   VITE_APP_ENV=production
   VITE_GOOGLE_MAPS_API_KEY=your-key-here
   ```

3. **Configure Dokploy settings:**
   - **Port**: 80
   - **Domain**: yourdomain.com
   - **Health Check Path**: /health

4. **Deploy!**

### How It Works

1. **Frontend requests** (/, /about, /services, etc.):
   - NGINX serves static React files
   - SPA routing handled by `try_files` fallback to index.html

2. **API requests** (/api/*, /health):
   - NGINX proxies to Node.js backend on localhost:5000
   - Backend handles all API logic

3. **Process Management**:
   - Supervisor runs both NGINX and Node.js
   - If either crashes, it auto-restarts
   - Health check monitors both processes

### Local Testing

Test the monorepo build locally:

```bash
# Build the image
docker build -t lobo-auto:test .

# Run with required environment
docker run -p 80:80 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NODE_ENV=production \
  -e CORS_ORIGIN=http://localhost \
  lobo-auto:test

# Test endpoints
curl http://localhost/          # Should return frontend HTML
curl http://localhost/api/health # Should return backend health check
```

### Troubleshooting

**Issue**: "Route not found" on home page
- **Cause**: API requests hitting backend instead of frontend
- **Fix**: Ensure NGINX location blocks are ordered correctly (specific before general)

**Issue**: CORS errors
- **Cause**: CORS_ORIGIN doesn't match your domain
- **Fix**: Set CORS_ORIGIN to match your actual domain (no trailing slash)

**Issue**: 502 Bad Gateway
- **Cause**: Backend not starting or health check failing
- **Fix**: Check logs for backend startup errors, ensure DATABASE_URL is correct

**Issue**: Frontend shows but API calls fail
- **Cause**: NGINX not proxying correctly
- **Fix**: Verify nginx.conf has `/api/` location block before `/` block

### Architecture Diagram

```
Internet
    ↓
[Traefik/Dokploy]
    ↓
Container (Port 80)
    ↓
[NGINX]
    ├─→ /api/* → http://localhost:5000 (Node.js Backend)
    ├─→ /health → http://localhost:5000 (Health Check)
    └─→ /* → /usr/share/nginx/html (React Frontend)
```

### File Structure

```
/
├── Dockerfile                 # Monorepo multi-stage build
├── frontend/
│   ├── nginx.conf            # NGINX config with API proxying
│   └── Dockerfile            # Individual frontend build (not used in monorepo)
└── backend/
    └── Dockerfile            # Individual backend build (not used in monorepo)
```
