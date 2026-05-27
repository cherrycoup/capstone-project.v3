# Production Deployment

This project is split into a Vite frontend and an Express/MongoDB API.

## Required environment variables

Server:

- `PORT`
- `NODE_ENV=production`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`
- `PUBLIC_APP_URL`
- `MEMBER_DISCOUNT_RATE`
- `MAIL_FROM`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- `PAYMENT_GATEWAY=paymongo` and `PAYMONGO_SECRET_KEY` when live checkout is enabled

Frontend:

- `VITE_API_BASE_URL=https://your-api-domain.com/api`

## Suggested deployment

1. Deploy `server` to Render using the included `render.yaml`, or to Railway/Fly.io/a VPS using `npm ci` then `npm start`.
2. Deploy `frontend` to Vercel using `frontend/vercel.json`, or to Netlify using `npm ci` then `npm run build`; publish `dist`.
3. Set `CORS_ORIGIN` on the server to the production frontend URL.
4. Configure SMTP and payment gateway keys in the server host secret manager.
5. Confirm `/api/health` returns success before opening the frontend to users.

The GitHub Actions workflow in `.github/workflows/ci.yml` installs both apps, lints the frontend, builds the frontend, and validates the server entry point on every PR and push.
