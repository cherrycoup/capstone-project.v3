# Production Deployment Checklist

## Backend (Express/Node.js)

### Environment Variables (Render/render.yaml)
Ensure these are set in your deployment host:

- ✅ `NODE_ENV=production` (already in render.yaml)
- ✅ `MONGODB_URI` - MongoDB Atlas connection string (set in host)
- ✅ `MONGODB_DB_NAME=jbm-electro-ventures` (already in render.yaml)
- ✅ `JWT_SECRET` - Strong random string, >32 chars (set in host)
- ✅ `JWT_EXPIRES_IN=2d` (already in render.yaml)
- ✅ `CORS_ORIGIN` - Production frontend URL (set in host)
- ✅ `PUBLIC_APP_URL` - Backend API domain (set in host)
- ✅ `MEMBER_DISCOUNT_RATE=0.10` (already in render.yaml)
- ✅ `MAIL_FROM` - Sender email (set in host)
- ✅ `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (set in host)
- ⚠️ `PAYMENT_GATEWAY=manual` or `paymongo` (already in render.yaml)
- ⚠️ `PAYMONGO_SECRET_KEY` - Only if live payments enabled (set in host)

### Build & Deploy
```bash
# Render auto-detects the backend via render.yaml
# Deployment runs: npm ci --production && npm start
```

### Health Check
```bash
# Verify after deployment:
curl https://your-api-domain.com/api/health
# Expected: {"success": true, "message": "Server is running"}
```

---

## Frontend (Vite/React)

### Environment Variables (Vercel)
Set these in Vercel dashboard:

- ✅ `VITE_API_BASE_URL=https://your-api-domain.com/api`
- ⚠️ `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID (set in host)

### Build & Deploy
```bash
# Vercel auto-detects via vercel.json
# Deployment runs: npm ci && npm run build
# Output directory: dist/
# Rewrites configured for SPA routing
```

---

## Docker

### Local Testing
```bash
# Build the image
docker build -t project-capstone-api:latest .

# Run locally with env vars
docker run -e NODE_ENV=production \
  -e MONGODB_URI="mongodb+srv://..." \
  -e JWT_SECRET="your-secret" \
  -e CORS_ORIGIN="http://localhost:3000" \
  -e PUBLIC_APP_URL="http://localhost:5000" \
  -p 5000:5000 \
  project-capstone-api:latest
```

### Registry (Docker Hub / Private)
```bash
docker tag project-capstone-api:latest your-username/project-capstone-api:latest
docker push your-username/project-capstone-api:latest
```

---

## Pre-Deployment Validation

### Backend
- [ ] `npm install` succeeds without errors
- [ ] No hardcoded secrets in `.env`
- [ ] `npm start` runs without connection errors (localhost test)
- [ ] Health endpoint responds: `/api/health`
- [ ] JWT_SECRET is >32 characters, not a placeholder
- [ ] CORS_ORIGIN matches frontend domain exactly
- [ ] MongoDB connection string is valid

### Frontend
- [ ] `npm run build` succeeds
- [ ] `dist/` folder generated with all static files
- [ ] `VITE_API_BASE_URL` points to production API
- [ ] No console errors in built bundle
- [ ] Vercel rewrites configured for SPA routing

### Integration
- [ ] Test login flow (customer + staff)
- [ ] Test payment flow (manual or PayMongo)
- [ ] Test email sending (password reset, OTP)
- [ ] Test appointment booking
- [ ] Check rate limiting doesn't block legitimate traffic

---

## Rollback Plan

1. Keep previous Docker image tagged: `project-capstone-api:latest-stable`
2. Store working environment variables in secure vault
3. Have database backup strategy (MongoDB Atlas automated backups)
4. Test rollback procedure before going live

---

## Monitoring (Post-Deployment)

- Health endpoint: `/api/health`
- Error logs: Check Render/host dashboard
- Frontend errors: Vercel Analytics
- Database: MongoDB Atlas dashboard
- Email delivery: Check SMTP logs

