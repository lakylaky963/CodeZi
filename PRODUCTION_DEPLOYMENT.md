# 🎮 CodeZi - Complete Deployment Guide

Your project is a **full-stack real-time poker application** with:
- **Frontend**: React (Vite) on Vercel
- **Backend**: Node.js + Socket.io on Google Cloud Run
- **Database**: MongoDB Atlas (Cloud)
- **Real-time**: WebSocket + Polling via Socket.io

---

## 🚀 RUNNING LOCALLY (Development)

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** running locally OR MongoDB Atlas connection string
- **.env files** configured

### Step 1: Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

# Return to root
cd ..
```

### Step 2: Configure Environment Files

**`server/.env`** (Create this file):
```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/codezi
CLIENT_URL=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174
```

**`client/.env.local`** (Already created):
```env
VITE_SERVER_URL=http://localhost:8080
```

### Step 3: Start Development Servers

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
# Expected output:
# 🟢 CodeZi Real-Time Server ACTIVE on port: 8080
# 🟢 MongoDB connected: true
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
# Expected output:
# VITE v5.4.21  ready in 627 ms
# ➜  Local:   http://localhost:5174/
```

### Step 4: Open Browser
- Visit: `http://localhost:5174`
- Go to **Poker** or **Poker Multi** page
- Status should show 🟢 **Server Online**

---

## ☁️ DEPLOYING TO PRODUCTION

### Architecture Overview
```
┌─────────────────────────────────────────────┐
│         codezi.vercel.app (Frontend)        │
│  - React app built & deployed on Vercel     │
│  - Environment: VITE_SERVER_URL = GCP URL   │
└──────────────┬──────────────────────────────┘
               │ Socket.io Connection
               ↓
┌─────────────────────────────────────────────┐
│   GCP Cloud Run (Backend)                   │
│  - Node.js server with Babel                │
│  - Handles real-time poker logic            │
│  - CORS configured for Vercel domain        │
└──────────────┬──────────────────────────────┘
               │ Database Connection
               ↓
┌─────────────────────────────────────────────┐
│   MongoDB Atlas (Database)                  │
│  - Cloud cluster with network access 0.0.0.0│
└─────────────────────────────────────────────┘
```

---

## 📡 STEP 1: Deploy Backend to GCP Cloud Run

### 1.1 Prerequisites
```bash
# Install Google Cloud CLI
# Download from: https://cloud.google.com/sdk/docs/install

# Verify installation
gcloud --version

# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project YOUR-PROJECT-ID
```

### 1.2 Build & Push Docker Image

```bash
# Set variables
$PROJECT_ID = "YOUR-PROJECT-ID"
$SERVICE_NAME = "poker-server"
$REGION = "us-central1"

# Build Docker image
docker build -t poker-server:latest .

# Tag for GCP
docker tag poker-server:latest gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

# Configure Docker authentication
gcloud auth configure-docker

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest
```

### 1.3 Deploy to Cloud Run

```bash
# Deploy with environment variables
gcloud run deploy $SERVICE_NAME `
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory 1Gi `
  --timeout 3600 `
  --set-env-vars `
    "NODE_ENV=production,`
     MONGODB_URI=$MONGODB_ATLAS_URI,`
     CLIENT_URL=https://codezi.vercel.app,`
     PORT=8080"
```

**Example with actual values:**
```bash
gcloud run deploy poker-server `
  --image gcr.io/my-project/poker-server:latest `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars "MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codezi?retryWrites=true&w=majority,CLIENT_URL=https://codezi.vercel.app"
```

### 1.4 Get Your Cloud Run URL
```bash
gcloud run services describe poker-server --region us-central1 --format='value(status.url)'
```

Example output:
```
https://poker-server-7x9k2j3h.run.app
```

✅ **Save this URL** - you'll need it for the frontend

---

## 🎨 STEP 2: Deploy Frontend to Vercel

### 2.1 Prerequisites
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

### 2.2 Configure Environment Variables

**Option A: Via Vercel CLI**
```bash
cd client

# Set production environment variable
vercel env add VITE_SERVER_URL
# Paste: https://poker-server-7x9k2j3h.run.app

# Set for production only
vercel env add VITE_SERVER_URL https://poker-server-7x9k2j3h.run.app --production
```

**Option B: Via Vercel Dashboard**
1. Go to **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `VITE_SERVER_URL`
   - **Value**: `https://poker-server-7x9k2j3h.run.app` (your Cloud Run URL)
   - **Environment**: Production

### 2.3 Deploy Frontend

```bash
cd client

# Deploy to production
vercel --prod

# Or redeploy if already connected
vercel deploy --prod
```

**Expected Output:**
```
✅ Production: https://codezi.vercel.app [v1234]
```

---

## 🔗 STEP 3: Verify Full Connection

### 3.1 Test Backend Health
```bash
curl https://poker-server-7x9k2j3h.run.app/health

# Expected Response:
# {"status":"ok","timestamp":"2026-06-24T14:30:00Z","environment":"production"}
```

### 3.2 Test API Ping
```bash
curl https://poker-server-7x9k2j3h.run.app/api/ping

# Expected Response:
# {"message":"pong","serverTime":"2026-06-24T14:30:00Z","connections":2}
```

### 3.3 Test Frontend Connection
1. Visit: `https://codezi.vercel.app`
2. Go to **Poker Multi** page
3. Status should show: **🟢 Server Online**
4. Open Browser Console (F12) to see:
   ```
   🎮 Poker game connecting to: https://poker-server-7x9k2j3h.run.app
   ✅ Connected to server: [socket-id]
   ```

---

## ⚙️ CONFIGURATION CHECKLIST

### Backend (server/.env)
- [ ] `PORT=8080`
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI=mongodb+srv://...` (MongoDB Atlas connection)
- [ ] `CLIENT_URL=https://codezi.vercel.app` (Vercel frontend URL)

### Frontend (client/.env.production)
- [ ] `VITE_SERVER_URL=https://poker-server-xxxxx.run.app` (GCP Cloud Run URL)

### GCP Cloud Run
- [ ] Image pushed to `gcr.io/PROJECT/poker-server`
- [ ] Environment variables set
- [ ] Allow unauthenticated access
- [ ] Memory: 1Gi, Timeout: 3600s

### Vercel
- [ ] Frontend linked to GitHub repo
- [ ] Environment variable `VITE_SERVER_URL` set to GCP URL
- [ ] Production deployment successful

### MongoDB Atlas
- [ ] Network Access: `0.0.0.0/0` (open) ✅ Already configured
- [ ] Connection string copied
- [ ] Database `codezi` exists

---

## 🐛 TROUBLESHOOTING

### Frontend shows "🔴 Connecting..." or "Connection failed"

**Check 1: Verify Backend is Running**
```bash
curl https://your-gcp-url.run.app/health
```
If fails → Backend not deployed or stopped

**Check 2: Verify Environment Variable**
```bash
# In Vercel dashboard, go to Settings → Environment Variables
# Confirm VITE_SERVER_URL is set correctly
```

**Check 3: Check Browser Console**
- Open DevTools: `F12` → **Console** tab
- Look for error messages
- Should see: `🎮 Poker game connecting to: https://...`

**Check 4: CORS Issues**
- Ensure backend has `CLIENT_URL=https://codezi.vercel.app`
- Vercel frontend URL should be in `allowedOrigins`

### Backend Crashing

**Check Logs:**
```bash
gcloud run logs read poker-server --region us-central1 --limit 50
```

**Common Issues:**
- MongoDB connection fails → Check `MONGODB_URI`
- Port conflicts → Already using 8080 locally
- Memory limit → Increase in Cloud Run settings

### Port 8080 Already in Use (Local Dev)

```bash
# Find process using port 8080
Get-NetTCPConnection -LocalPort 8080 | Select-Object -ExpandProperty OwningProcess

# Kill process
Stop-Process -Id [PID] -Force

# Or use different port
PORT=8081 npm run dev
```

---

## 📊 MONITORING

### Monitor Backend Logs
```bash
# Real-time logs
gcloud run logs read poker-server --follow

# Last 100 lines
gcloud run logs read poker-server --limit 100
```

### Monitor Frontend
- Vercel Dashboard → **Deployments** → View logs
- Check function performance & errors

### Monitor Database
- MongoDB Atlas → **Activity** tab
- Check connection count & performance

---

## 🔄 DEPLOYMENT WORKFLOW

### When You Make Changes

1. **Backend Changes**
   ```bash
   git add server/
   git commit -m "feat: update poker logic"
   docker build -t gcr.io/PROJECT/poker-server:latest .
   docker push gcr.io/PROJECT/poker-server:latest
   gcloud run deploy poker-server --image gcr.io/PROJECT/poker-server:latest
   ```

2. **Frontend Changes**
   ```bash
   git add client/
   git commit -m "feat: update UI"
   cd client
   vercel --prod
   ```

3. **Both Changes**
   - Deploy backend first, test health endpoint
   - Deploy frontend second, verify Socket.io connection

---

## 💾 BACKUP & RECOVERY

### Database Backup
```bash
# MongoDB Atlas automatic daily backups
# Manual export
mongoexport --uri="mongodb+srv://user:pass@cluster.mongodb.net/codezi" --collection=rooms --out=rooms.json
```

### Code Recovery
- GitHub as source of truth
- Tag releases: `git tag -a v1.0.0 -m "Production release"`
- Vercel/GCP automatically track deployments

---

## 🚨 PRODUCTION SECURITY

- [x] Environment variables not in code
- [x] MongoDB network access restricted (currently open)
- [x] CORS configured for specific domains
- [x] HTTPS enforced (Vercel + Cloud Run)
- [ ] Add authentication for API endpoints
- [ ] Add rate limiting
- [ ] Add request validation
- [ ] Add logging & monitoring

---

## 📈 SCALING NOTES

Current setup handles ~100 concurrent connections. For scaling:
- Increase Cloud Run memory/CPU
- Enable Cloud Run autoscaling
- Add Firestore for distributed game state (if needed)
- Use Pub/Sub for cross-instance messaging

---

## ✅ QUICK CHECKLIST

- [ ] Backend deployed to GCP Cloud Run
- [ ] Frontend deployed to Vercel with env vars
- [ ] MongoDB Atlas connection working
- [ ] Health check passing: `curl.../health`
- [ ] Socket.io connecting: Browser console shows "✅ Connected"
- [ ] Poker game playable online
- [ ] Logs monitoring set up

---

**🎉 You're ready to go live!**

Visit: https://codezi.vercel.app/poker-multi

Any connection issues? Check the troubleshooting section above.
