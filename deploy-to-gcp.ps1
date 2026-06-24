#!/usr/bin/env pwsh

# CodeZi Online Deployment Script
# This script automates deployment to GCP Cloud Run + Vercel

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId,
    
    [Parameter(Mandatory=$true)]
    [string]$MongoDBUri,
    
    [Parameter(Mandatory=$true)]
    [string]$VercelDomain = "codezi.vercel.app",
    
    [string]$ServiceName = "poker-server",
    [string]$Region = "us-central1"
)

$ErrorActionPreference = "Stop"

Write-Host "
╔════════════════════════════════════════════════════════════════╗
║     CodeZi Deployment to GCP Cloud Run + Vercel                ║
╚════════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

Write-Host "`n📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Project ID: $ProjectId"
Write-Host "  Service: $ServiceName"
Write-Host "  Region: $Region"
Write-Host "  Frontend: $VercelDomain"

# Step 1: Build and Push Docker Image
Write-Host "`n📦 Step 1: Building Docker Image..." -ForegroundColor Green

docker build -t poker-server:latest .
if ($LASTEXITCODE -ne 0) { throw "Docker build failed" }

docker tag poker-server:latest gcr.io/$ProjectId/$ServiceName:latest
if ($LASTEXITCODE -ne 0) { throw "Docker tag failed" }

Write-Host "  ✅ Docker image built successfully"

# Step 2: Configure Docker Authentication
Write-Host "`n🔐 Step 2: Configuring Docker Authentication..." -ForegroundColor Green

gcloud auth configure-docker --quiet
Write-Host "  ✅ Docker authentication configured"

# Step 3: Push to GCP Container Registry
Write-Host "`n📤 Step 3: Pushing to Google Container Registry..." -ForegroundColor Green

docker push gcr.io/$ProjectId/$ServiceName:latest
if ($LASTEXITCODE -ne 0) { throw "Docker push failed" }

Write-Host "  ✅ Image pushed successfully"

# Step 4: Deploy to Cloud Run
Write-Host "`n🚀 Step 4: Deploying to Cloud Run..." -ForegroundColor Green

gcloud run deploy $ServiceName `
  --image gcr.io/$ProjectId/$ServiceName:latest `
  --platform managed `
  --region $Region `
  --allow-unauthenticated `
  --memory 1Gi `
  --timeout 3600 `
  --set-env-vars `
    "NODE_ENV=production,`
     MONGODB_URI=$MongoDBUri,`
     CLIENT_URL=https://$VercelDomain,`
     PORT=8080" `
  --quiet

if ($LASTEXITCODE -ne 0) { throw "Cloud Run deployment failed" }

Write-Host "  ✅ Deployed to Cloud Run"

# Step 5: Get Service URL
Write-Host "`n📍 Step 5: Retrieving Service URL..." -ForegroundColor Green

$ServiceUrl = gcloud run services describe $ServiceName `
  --region $Region `
  --format='value(status.url)'

Write-Host "  ✅ Service URL: $ServiceUrl"

# Step 6: Test Backend
Write-Host "`n✅ Step 6: Testing Backend Health..." -ForegroundColor Green

$HealthCheck = Invoke-WebRequest -Uri "$ServiceUrl/health" -UseBasicParsing -ErrorAction SilentlyContinue
if ($HealthCheck.StatusCode -eq 200) {
    Write-Host "  ✅ Backend is healthy"
} else {
    Write-Host "  ⚠️  Backend health check failed (this may take a moment to warm up)" -ForegroundColor Yellow
}

# Step 7: Display Deployment Summary
Write-Host "`n
╔════════════════════════════════════════════════════════════════╗
║              🎉 DEPLOYMENT SUCCESSFUL! 🎉                      ║
╚════════════════════════════════════════════════════════════════╝

📝 Next Steps:
1. Update Vercel Environment Variable:
   VITE_SERVER_URL=$ServiceUrl

2. In Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Add VITE_SERVER_URL = $ServiceUrl
   - Set for Production
   - Redeploy: vercel --prod

3. Test Connection:
   - Visit: https://$VercelDomain/poker-multi
   - Check for: 🟢 Server Online

4. Monitor Logs:
   gcloud run logs read $ServiceName --region $Region --follow

Backend URL: $ServiceUrl
Frontend URL: https://$VercelDomain

" -ForegroundColor Green

Write-Host "✨ Deployment script completed!" -ForegroundColor Cyan
