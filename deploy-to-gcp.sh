#!/bin/bash

# CodeZi Online Deployment Script (Bash version)
# This script automates deployment to GCP Cloud Run + Vercel

set -e

# Configuration
PROJECT_ID="${1:-}"
MONGODB_URI="${2:-}"
VERCEL_DOMAIN="${3:-codezi.vercel.app}"
SERVICE_NAME="${4:-poker-server}"
REGION="${5:-us-central1}"

if [ -z "$PROJECT_ID" ] || [ -z "$MONGODB_URI" ]; then
    echo "Usage: ./deploy-to-gcp.sh <project-id> <mongodb-uri> [vercel-domain] [service-name] [region]"
    echo ""
    echo "Example:"
    echo "  ./deploy-to-gcp.sh my-project 'mongodb+srv://user:pass@cluster.mongodb.net/codezi?retryWrites=true&w=majority'"
    echo ""
    echo "Or with all options:"
    echo "  ./deploy-to-gcp.sh my-project 'mongodb+srv://...' codezi.vercel.app poker-server us-central1"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     CodeZi Deployment to GCP Cloud Run + Vercel                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📋 Configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Service: $SERVICE_NAME"
echo "  Region: $REGION"
echo "  Frontend: $VERCEL_DOMAIN"
echo ""

# Step 1: Build and Push Docker Image
echo "📦 Step 1: Building Docker Image..."
docker build -t poker-server:latest .
docker tag poker-server:latest gcr.io/$PROJECT_ID/$SERVICE_NAME:latest
echo "  ✅ Docker image built successfully"
echo ""

# Step 2: Configure Docker Authentication
echo "🔐 Step 2: Configuring Docker Authentication..."
gcloud auth configure-docker --quiet
echo "  ✅ Docker authentication configured"
echo ""

# Step 3: Push to GCP Container Registry
echo "📤 Step 3: Pushing to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest
echo "  ✅ Image pushed successfully"
echo ""

# Step 4: Deploy to Cloud Run
echo "🚀 Step 4: Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 1Gi \
  --timeout 3600 \
  --set-env-vars \
    NODE_ENV=production,\
MONGODB_URI=$MONGODB_URI,\
CLIENT_URL=https://$VERCEL_DOMAIN,\
PORT=8080 \
  --quiet

echo "  ✅ Deployed to Cloud Run"
echo ""

# Step 5: Get Service URL
echo "📍 Step 5: Retrieving Service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format='value(status.url)')

echo "  ✅ Service URL: $SERVICE_URL"
echo ""

# Step 6: Test Backend
echo "✅ Step 6: Testing Backend Health..."
if curl -s "$SERVICE_URL/health" | grep -q "ok"; then
    echo "  ✅ Backend is healthy"
else
    echo "  ⚠️  Backend health check failed (may need a moment to warm up)"
fi
echo ""

# Display Deployment Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              🎉 DEPLOYMENT SUCCESSFUL! 🎉                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📝 Next Steps:"
echo "1. Update Vercel Environment Variable:"
echo "   VITE_SERVER_URL=$SERVICE_URL"
echo ""
echo "2. In Vercel Dashboard:"
echo "   - Go to Settings → Environment Variables"
echo "   - Add VITE_SERVER_URL = $SERVICE_URL"
echo "   - Set for Production"
echo "   - Redeploy: vercel --prod"
echo ""
echo "3. Test Connection:"
echo "   - Visit: https://$VERCEL_DOMAIN/poker-multi"
echo "   - Check for: 🟢 Server Online"
echo ""
echo "4. Monitor Logs:"
echo "   gcloud run logs read $SERVICE_NAME --region $REGION --follow"
echo ""

echo "Backend URL: $SERVICE_URL"
echo "Frontend URL: https://$VERCEL_DOMAIN"
echo ""

echo "✨ Deployment script completed!"
