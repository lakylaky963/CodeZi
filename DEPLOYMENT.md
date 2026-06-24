# Socket.IO Poker Game - Deployment Guide

## 🚀 Quick Start for Development

```bash
# Terminal 1: Start MongoDB (if using local DB)
mongod

# Terminal 2: Start Backend
cd server
npm install
npm run dev

# Terminal 3: Start Frontend
cd client
npm install
npm run dev
```

Your app will be at `http://localhost:5173`

---

## 🔌 Setting Up Backend Environment Variables

### Local Development (`.env` in `server/`)
```
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codezi
CLIENT_URL=http://localhost:5173,http://localhost:5174
```

### Vercel/Production (Add to Vercel Project Settings)
```
PORT=8080
NODE_ENV=production
MONGODB_URI=<your-mongodb-cloud-uri>
CLIENT_URL=https://your-frontend-url.vercel.app,https://your-custom-domain.com
```

---

## 📡 Setting Up Frontend for GCP Backend

### Local Development (`.env.local` in `client/`)
```
VITE_SERVER_URL=http://localhost:8080
```

### Production with GCP Cloud Run (`.env.production` in `client/`)
```
VITE_SERVER_URL=https://your-service-xxxxx.run.app
```

**How to get your GCP Cloud Run URL:**
1. Deploy your server to Google Cloud Run
2. Copy the service URL (e.g., `https://poker-server-abc123.run.app`)
3. Set `VITE_SERVER_URL` to this URL

### Setting Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add:
   ```
   VITE_SERVER_URL=https://your-gcp-backend-url.run.app
   ```
3. Redeploy: `vercel --prod`

---

## ✅ Testing the Connection

### Test Backend Health
```bash
curl https://your-gcp-backend-url.run.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:30:45.123Z",
  "environment": "production"
}
```

### Test Ping Endpoint
```bash
curl https://your-gcp-backend-url.run.app/api/ping
```

Expected response:
```json
{
  "message": "pong",
  "serverTime": "2024-01-20T10:30:45.123Z",
  "connections": 5
}
```

---

## 🐛 Troubleshooting Connection Issues

### "Connecting..." Stuck in UI
1. **Check browser console** (F12 → Console tab)
   - Look for connection errors
   - Check if `VITE_SERVER_URL` is set correctly

2. **Verify backend is running**
   ```bash
   curl https://your-gcp-backend-url.run.app/health
   ```

3. **Check CORS configuration**
   - Server allows your frontend URL in `CLIENT_URL` env var
   - Add to Vercel env vars: `CLIENT_URL=https://your-frontend.vercel.app`

4. **Verify environment variables in Vercel**
   - Go to Settings → Environment Variables
   - Confirm `VITE_SERVER_URL` is set to GCP backend URL
   - Trigger redeploy: `vercel --prod`

### Connection Timeout (10s)
- Server unreachable or down
- Check GCP Cloud Run logs:
  ```bash
  gcloud run logs read <service-name>
  ```

### "Connection failed" Error Message
- Invalid `VITE_SERVER_URL`
- CORS blocked
- Backend not started

---

## 🌐 GCP Cloud Run Deployment (Backend)

```bash
# Build Docker image
docker build -t poker-server .

# Tag for GCP
docker tag poker-server gcr.io/YOUR-PROJECT-ID/poker-server

# Push to GCP
docker push gcr.io/YOUR-PROJECT-ID/poker-server

# Deploy to Cloud Run
gcloud run deploy poker-server \
  --image gcr.io/YOUR-PROJECT-ID/poker-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGODB_URI=<your-mongo-uri>,CLIENT_URL=https://your-frontend.vercel.app"
```

---

## 📋 Implementation Features Added

✅ **Better Error Handling**
- Connection errors logged to console
- User-friendly error messages displayed
- Auto-reconnection with exponential backoff

✅ **Environment Variables**
- `.env.local` for local development
- `.env.production` for production build
- `VITE_` prefix for frontend access

✅ **Socket.IO Improvements**
- Websocket + polling fallback
- Connection state recovery
- Configurable timeouts & ping intervals
- Detailed connection logging

✅ **Server Health Checks**
- `/health` endpoint for monitoring
- `/api/ping` for client-side connectivity test
- Connection count tracking

✅ **Production Ready**
- CORS properly configured
- Vercel environment setup
- GCP Cloud Run compatible

---

## 🔗 Next Steps

1. Deploy backend to GCP Cloud Run
2. Get the Cloud Run URL
3. Set `VITE_SERVER_URL` in Vercel environment variables
4. Redeploy frontend on Vercel
5. Test connection from poker game page
6. Check browser console for detailed logs

Good luck! 🎮
