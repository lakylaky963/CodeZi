# 🔧 CodeZi - Quick Reference & Troubleshooting

## 🆘 PORT 8080 ALREADY IN USE

### Windows (PowerShell)
```powershell
# Find and kill process on port 8080
Get-NetTCPConnection -LocalPort 8080 | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force

# Or use different port
$env:PORT=8081; npm run dev
```

### Mac/Linux
```bash
# Find process
lsof -i :8080

# Kill process
kill -9 <PID>

# Or use different port
PORT=8081 npm run dev
```

---

## 🚀 QUICK START (Development)

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install
cd ..

# 2. Create server/.env
# Copy from server/.env.example

# 3. Terminal 1: Start backend
cd server && npm run dev
# Should see: 🟢 CodeZi Real-Time Server ACTIVE on port: 8080

# 4. Terminal 2: Start frontend
cd client && npm run dev
# Should see: ➜  Local:   http://localhost:5174/

# 5. Open browser: http://localhost:5174
```

---

## 🌐 DEPLOYMENT ARCHITECTURE

```
                    User Browser
                        ↓
           ┌─────────────────────────────┐
           │   codezi.vercel.app         │
           │  (React + Vite)             │
           │  VITE_SERVER_URL = GCP URL  │
           └──────────┬──────────────────┘
                      │ Socket.io + Polling
                      ↓
           ┌─────────────────────────────┐
           │   GCP Cloud Run             │
           │   poker-server-xxxxx        │
           │  (Node.js + Express)        │
           │  + Socket.io                │
           └──────────┬──────────────────┘
                      │ Mongoose Driver
                      ↓
           ┌─────────────────────────────┐
           │   MongoDB Atlas             │
           │   Cloud Cluster             │
           │   Network: 0.0.0.0/0        │
           └─────────────────────────────┘
```

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deployment
- [ ] All code committed to GitHub
- [ ] Environment files created (not in git)
- [ ] MongoDB Atlas cluster created
- [ ] GCP project created with billing enabled
- [ ] Docker installed and tested locally

### Backend Deployment (GCP)
- [ ] Dockerfile exists and builds
- [ ] `docker build` successful
- [ ] `gcloud auth login` successful
- [ ] `docker push gcr.io/...` successful
- [ ] `gcloud run deploy` successful
- [ ] Service URL obtained
- [ ] Health check passes

### Frontend Deployment (Vercel)
- [ ] `npm run build` successful in client/
- [ ] Git repo connected to Vercel
- [ ] Environment variable `VITE_SERVER_URL` set in Vercel
- [ ] `vercel --prod` successful
- [ ] Socket.io shows "🟢 Server Online"

### Database
- [ ] MongoDB Atlas cluster running
- [ ] Network access: 0.0.0.0/0 configured
- [ ] Connection string obtained
- [ ] `codezi` database exists
- [ ] Collections created (if needed)

---

## 🔍 COMMON ISSUES & SOLUTIONS

### ❌ "Connecting..." stuck on poker page

**Problem**: Frontend can't reach backend
```bash
# Check 1: Backend URL correct?
echo $VITE_SERVER_URL

# Check 2: Backend running?
curl https://your-backend-url.run.app/health

# Check 3: Vercel env vars set?
vercel env ls

# Check 4: Frontend built with correct URL?
vercel redeploy --prod
```

### ❌ Docker build fails
```bash
# Clean build
docker build --no-cache -t poker-server:latest .

# Check Docker daemon
docker ps

# Check disk space
docker system df
```

### ❌ MongoDB connection error
```bash
# Test connection string
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/codezi"

# Check network access in Atlas
# Settings → Network Access → Should see 0.0.0.0/0

# Check connection string format
# Should contain ?retryWrites=true&w=majority
```

### ❌ GCP deployment fails
```bash
# Check gcloud config
gcloud config list

# Check project ID
gcloud config get-value project

# Check project billing
gcloud billing accounts list

# Check deployment status
gcloud run describe poker-server --region us-central1
```

### ❌ CORS errors in console
```
Access to XMLHttpRequest at 'https://...' from origin 'https://codezi.vercel.app' 
has been blocked by CORS policy
```

**Solution**: Update backend `CLIENT_URL` env variable
```bash
gcloud run deploy poker-server \
  --set-env-vars CLIENT_URL=https://codezi.vercel.app
```

---

## 🔐 DEBUGGING COMMANDS

### View Backend Logs (Real-time)
```bash
gcloud run logs read poker-server --region us-central1 --follow
```

### View Last 100 Log Lines
```bash
gcloud run logs read poker-server --limit 100
```

### Test Backend Endpoints
```bash
# Health check
curl https://poker-server-xxxxx.run.app/health

# Ping endpoint
curl https://poker-server-xxxxx.run.app/api/ping

# Both with verbose output
curl -v https://poker-server-xxxxx.run.app/health
```

### Browser Console Debugging
Open DevTools (F12) → Console tab, look for:
```
✅ Connected to server: abc123xyz
🎮 Poker game connecting to: https://...
🔴 Connection error: ...
```

### Check Vercel Deployment
```bash
# View deployment logs
vercel logs

# Rebuild
vercel rebuild

# Redeploy specific environment
vercel --prod
```

---

## 📊 PERFORMANCE MONITORING

### GCP Cloud Run Metrics
1. Go to **GCP Console** → **Cloud Run** → **poker-server**
2. View:
   - Request count
   - Error rate
   - Response time
   - Memory usage

### MongoDB Atlas Metrics
1. Go to **MongoDB Atlas** → **Cluster** → **Metrics**
2. Monitor:
   - Connections
   - Operations/sec
   - Storage

### Vercel Analytics
1. Go to **Vercel Dashboard** → **codezi**
2. View:
   - Response time
   - Build time
   - Error rate

---

## 🔄 REDEPLOYMENT PROCESS

### When you update backend code
```bash
git add server/
git commit -m "feat: update poker handler"

docker build -t gcr.io/PROJECT/poker-server:latest .
docker push gcr.io/PROJECT/poker-server:latest

gcloud run deploy poker-server \
  --image gcr.io/PROJECT/poker-server:latest \
  --region us-central1
```

### When you update frontend code
```bash
git add client/
git commit -m "feat: update UI"

cd client
vercel --prod
```

### When you need to clear cache
```bash
# Frontend
vercel rebuild && vercel --prod

# Backend
gcloud run deploy poker-server --region us-central1 --no-traffic

# Then switch traffic
gcloud run services update-traffic poker-server --to-revisions LATEST=100
```

---

## 💡 USEFUL LINKS

- **GCP Cloud Run**: https://cloud.google.com/run/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Socket.io**: https://socket.io/docs/v4/
- **Docker**: https://docs.docker.com/

---

## ✅ VERIFICATION STEPS

### Local Development (http://localhost:5174)
- [ ] Backend responds to `curl localhost:8080/health`
- [ ] Frontend loads without errors
- [ ] Poker page shows "🟢 Server Online"
- [ ] Can join a room and start game
- [ ] Real-time updates work

### Production (https://codezi.vercel.app)
- [ ] Frontend loads
- [ ] Poker page shows "🟢 Server Online"
- [ ] Browser console shows "✅ Connected to server"
- [ ] Can join room and play
- [ ] Real-time multiplayer works
- [ ] No CORS errors

---

**Still stuck? Check:**
1. Browser console (F12)
2. GCP logs: `gcloud run logs read poker-server --follow`
3. Vercel logs: `vercel logs`
4. MongoDB logs: Atlas dashboard → Activity
