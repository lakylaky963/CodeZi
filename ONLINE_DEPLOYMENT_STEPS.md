# CodeZi - Step-by-Step Online Deployment Guide

## Visual Overview

```
Your Computer (Development)
    ↓
GitHub (Code Repository)
    ↓
Vercel (Frontend Hosting) ← Google Cloud Run (Backend) → MongoDB Atlas (Database)
                                    ↑
                            Socket.io Real-time
```

---

## 📝 COMPLETE STEPS (Copy-Paste Ready)

### STEP 0: Prerequisites Setup

#### Windows
```powershell
# Install/Update Google Cloud SDK
# Download from: https://cloud.google.com/sdk/docs/install-gcloud-cli

# Verify installation
gcloud --version

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop
```

#### Mac
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Install Docker
# Download: https://www.docker.com/products/docker-desktop
```

#### Linux (Ubuntu)
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash

# Install Docker
sudo apt-get update
sudo apt-get install docker.io
sudo usermod -aG docker $USER
```

---

### STEP 1: Prepare Your Project

```bash
cd c:\Users\lakyl\OneDrive\מסמכים\GitHub\mern-boilerplate-v2

# Ensure all code is committed
git status

# Should show: "On branch main, nothing to commit"
# If not, commit your changes:
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

---

### STEP 2: Set Up MongoDB Atlas

1. **Go to**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Account** and verify email
3. **Create Organization** and project
4. **Create Cluster**:
   - Free tier (M0)
   - Region: US East (N. Virginia) or closest to you
   - Click "Create"
5. **Wait 5-10 minutes** for cluster to deploy
6. **Add Network Access**:
   - Security → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - Click "Confirm"
7. **Create Database User**:
   - Security → Database Access
   - Add Database User
   - Username: `codezi_user`
   - Password: Generate strong password (save this!)
   - Built-in Role: Atlas Admin
8. **Get Connection String**:
   - Databases → Click your cluster
   - Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Should look like:
     ```
     mongodb+srv://codezi_user:PASSWORD@cluster0.xxxxx.mongodb.net/codezi?retryWrites=true&w=majority
     ```

---

### STEP 3: Deploy Backend to Google Cloud Run

```bash
# 1. Login to Google Cloud
gcloud auth login
# Follow browser prompt to login

# 2. Set your project ID
gcloud config set project YOUR-PROJECT-ID
# (Replace YOUR-PROJECT-ID with actual ID)

# 3. Verify project is set correctly
gcloud config list

# 4. Run deployment script
# PowerShell (Windows)
.\deploy-to-gcp.ps1 -ProjectId YOUR-PROJECT-ID -MongoDBUri "mongodb+srv://codezi_user:PASSWORD@cluster0.xxxxx.mongodb.net/codezi?retryWrites=true&w=majority"

# OR Bash (Mac/Linux)
./deploy-to-gcp.sh YOUR-PROJECT-ID "mongodb+srv://codezi_user:PASSWORD@cluster0.xxxxx.mongodb.net/codezi?retryWrites=true&w=majority"
```

**Script will:**
- Build Docker image
- Push to Google Container Registry
- Deploy to Cloud Run
- Output your backend URL

**Save the URL** that looks like:
```
https://poker-server-7x9k2j3h.run.app
```

---

### STEP 4: Deploy Frontend to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login
# Click link, login with GitHub

# 3. Navigate to client folder
cd client

# 4. Set environment variable
vercel env add VITE_SERVER_URL
# Paste your backend URL: https://poker-server-xxxxx.run.app

# 5. Confirm it's for Production
# Select: Production

# 6. Deploy to production
vercel --prod

# You'll see:
# ✅ Production: https://codezi.vercel.app
```

#### Option B: Using Vercel Dashboard

1. Go to: https://vercel.com/new
2. Import your GitHub repo: `mern-boilerplate-v2`
3. Configure project:
   - Framework: Vite
   - Root Directory: `./client`
   - Build Command: `vite build`
   - Output Directory: `dist`
4. Add environment variables:
   - Name: `VITE_SERVER_URL`
   - Value: `https://poker-server-xxxxx.run.app`
   - Environment: Production
5. Click "Deploy"

---

### STEP 5: Verify Everything Works

#### Test Backend
```bash
# Replace with your actual URL
curl https://poker-server-xxxxx.run.app/health

# Expected response:
# {"status":"ok","timestamp":"2026-06-24T14:30:00.000Z","environment":"production"}
```

#### Test Frontend
```bash
# Open browser to:
https://codezi.vercel.app/poker-multi

# Should show:
# 🟢 Server Online (in green)
# NOT "Connecting..." or 🔴 Connection failed
```

#### Test WebSocket Connection
1. Open DevTools: `F12`
2. Go to: **Console** tab
3. Look for messages:
   ```
   🎮 Poker game connecting to: https://poker-server-xxxxx.run.app
   ✅ Connected to server: [socket-id]
   ```

#### Test Gameplay
1. Open poker game page
2. Enter nickname: "TestPlayer"
3. Enter room: "test-room"
4. Click "Join Table"
5. You should see the poker table

---

## 🔄 MAKING UPDATES AFTER DEPLOYMENT

### Update Backend Code
```bash
# 1. Make changes to server/
# 2. Test locally: npm run dev in server/
# 3. Commit changes
git add server/
git commit -m "fix: update poker handler"
git push

# 4. Rebuild and deploy
cd ../
docker build -t gcr.io/YOUR-PROJECT/poker-server:latest .
docker push gcr.io/YOUR-PROJECT/poker-server:latest

gcloud run deploy poker-server \
  --image gcr.io/YOUR-PROJECT/poker-server:latest \
  --region us-central1
```

### Update Frontend Code
```bash
# 1. Make changes to client/
# 2. Test locally: npm run dev in client/
# 3. Commit changes
git add client/
git commit -m "feat: update UI"
git push

# 4. Redeploy
cd client
vercel --prod
```

---

## 📋 ENVIRONMENT VARIABLES REFERENCE

### Server (GCP Cloud Run)
Must be set in GCP Console or via deployment script:
```
PORT=8080
NODE_ENV=production
MONGODB_URI=mongodb+srv://codezi_user:PASSWORD@cluster0.xxxxx.mongodb.net/codezi?retryWrites=true&w=majority
CLIENT_URL=https://codezi.vercel.app
```

### Client (Vercel)
Set in Vercel Dashboard → Settings → Environment Variables:
```
VITE_SERVER_URL=https://poker-server-xxxxx.run.app
```

---

## ✅ FINAL CHECKLIST

- [ ] MongoDB Atlas cluster created and network access set to 0.0.0.0/0
- [ ] GCP project created with billing enabled
- [ ] Docker installed and tested
- [ ] Backend deployed to Cloud Run (service URL saved)
- [ ] Backend health check passing
- [ ] Frontend deployed to Vercel
- [ ] VITE_SERVER_URL environment variable set in Vercel
- [ ] Frontend shows "🟢 Server Online"
- [ ] Browser console shows "✅ Connected to server"
- [ ] Poker game is playable
- [ ] Real-time updates working (multiple players test)

---

## 🚀 YOUR LIVE WEBSITE

**Frontend**: https://codezi.vercel.app
**Poker Game**: https://codezi.vercel.app/poker-multi

---

## 🆘 STILL HAVING ISSUES?

1. **Check browser console** (F12 → Console)
2. **View backend logs**:
   ```bash
   gcloud run logs read poker-server --follow
   ```
3. **View deployment logs**:
   ```bash
   vercel logs
   ```
4. **Restart deployment**:
   ```bash
   # Backend
   gcloud run deploy poker-server --region us-central1
   
   # Frontend
   vercel --prod
   ```

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "Connecting..." stuck | Check `VITE_SERVER_URL` in Vercel env vars |
| Backend unreachable | Check `CLIENT_URL` includes `codezi.vercel.app` |
| MongoDB error | Verify connection string and network access (0.0.0.0/0) |
| CORS errors | Ensure `CLIENT_URL` matches Vercel domain |
| Docker build fails | Run `docker system prune` then rebuild |

---

**Congratulations! Your CodeZi poker game is now live! 🎉**
