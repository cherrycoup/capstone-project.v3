# Production Environment Variables Template

## Backend (.env for server/)

```env
# Node Environment
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=jbm-electro-ventures

# JWT & Authentication
JWT_SECRET=your-strong-secret-key-min-32-characters-long-do-not-use-placeholder
JWT_EXPIRES_IN=2d
JWT_ISSUER=jbm-electro-ventures
JWT_AUDIENCE=jbm-electro-ventures

# CORS & Public URLs
CORS_ORIGIN=https://your-frontend-domain.com
PUBLIC_APP_URL=https://your-api-domain.com

# Server Config
PORT=5000
NODE_ENV=production

# Email / SMTP (Gmail, SendGrid, or custom SMTP)
MAIL_FROM=noreply@your-domain.com
EMAIL_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-specific-password

# Email OTP & Password Reset
EMAIL_OTP_TTL_MINUTES=10
PASSWORD_RESET_TTL_MINUTES=30
PASSWORD_RESET_DEBUG=false

# Business Logic
MEMBER_DISCOUNT_RATE=0.10

# Payment Gateway (manual or paymongo)
PAYMENT_GATEWAY=manual
PAYMONGO_SECRET_KEY=pk_live_your_paymongo_secret_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Rate Limiting (Optional)
AUTH_RATE_LIMIT_MAX=120
AUTH_RATE_LIMIT_WINDOW_MS=900000

# DNS Servers (Optional, for specific regions)
DNS_SERVERS=8.8.8.8,8.8.4.4

# Admin Email (for system notifications)
ADMIN_EMAIL=admin@your-domain.com
```

---

## Frontend (.env for frontend/)

```env
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api

# Google OAuth (for customer login)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Build/Development (optional)
VITE_APP_NAME=JBM Electro Ventures
```

---

## Docker Build & Run

### Build
```bash
docker build -t project-capstone-api:latest .
```

### Run with Environment Variables
```bash
docker run \
  -e NODE_ENV=production \
  -e MONGODB_URI="mongodb+srv://..." \
  -e JWT_SECRET="your-secret" \
  -e CORS_ORIGIN="https://your-frontend.com" \
  -e PUBLIC_APP_URL="https://your-api.com" \
  -e MAIL_FROM="noreply@your-domain.com" \
  -e SMTP_HOST="smtp.gmail.com" \
  -e SMTP_USER="your-email@gmail.com" \
  -e SMTP_PASS="your-password" \
  -p 5000:5000 \
  project-capstone-api:latest
```

### Run with .env File
```bash
docker run --env-file server/.env -p 5000:5000 project-capstone-api:latest
```

---

## Deployment Hosts

### Render (Backend)
1. Create a Web Service on Render
2. Connect your GitHub repo
3. Set Root Directory: `server`
4. Build Command: `npm ci`
5. Start Command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy

### Vercel (Frontend)
1. Import project from GitHub
2. Set Framework: Vite
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add environment variables in Vercel dashboard
7. Deploy

### Docker Registry (Optional)
```bash
# Tag for Docker Hub
docker tag project-capstone-api:latest yourusername/project-capstone-api:latest
docker push yourusername/project-capstone-api:latest

# Or for private registry
docker tag project-capstone-api:latest registry.example.com/project-capstone-api:latest
docker push registry.example.com/project-capstone-api:latest
```

---

## Security Checklist

- [ ] JWT_SECRET is NOT in version control
- [ ] All credentials stored only in host environment
- [ ] CORS_ORIGIN is set to exact frontend domain
- [ ] SMTP credentials use app-specific passwords (not main account password)
- [ ] MongoDB connection uses strong password
- [ ] NODE_ENV is explicitly set to `production`
- [ ] Rate limiting is enabled
- [ ] Helmet middleware is active (security headers)
- [ ] HTTPS enabled on frontend and API domains

