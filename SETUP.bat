@echo off
echo 🎮 Poker Game Setup Guide
echo ==========================
echo.
echo Step 1: Install Dependencies
echo ----------------------------
echo cd server ^&^& npm install ^&^& cd ../client ^&^& npm install ^&^& cd ..
echo.

echo Step 2: Set up Local Environment Variables
echo -------------------------------------------
echo server\.env:
echo   PORT=8080
echo   MONGODB_URI=mongodb://localhost:27017/codezi
echo   CLIENT_URL=http://localhost:5173,http://localhost:5174
echo.
echo client\.env.local:
echo   VITE_SERVER_URL=http://localhost:8080
echo.

echo Step 3: Start Development Servers
echo ---------------------------------
echo Terminal 1 (Backend):
echo   cd server ^&^& npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd client ^&^& npm run dev
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8080
echo.

echo Step 4: For Vercel + GCP Deployment
echo -----------------------------------
echo 1. Deploy backend to GCP Cloud Run (see DEPLOYMENT.md)
echo 2. Get Cloud Run URL: https://your-service-xxxxx.run.app
echo 3. In Vercel project settings, add environment variable:
echo    VITE_SERVER_URL=https://your-service-xxxxx.run.app
echo 4. Redeploy frontend: vercel --prod
echo.

echo ✅ Setup Complete! Read DEPLOYMENT.md for detailed instructions.
pause
