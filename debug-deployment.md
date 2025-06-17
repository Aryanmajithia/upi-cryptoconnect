# Debug Deployment Guide

## 404 Error Troubleshooting

### Step 1: Check Backend Status

1. **Go to your Render dashboard**
2. **Check if your backend service is running** (green status)
3. **Check the logs** for any errors
4. **Copy your backend URL** (e.g., `https://your-app.onrender.com`)

### Step 2: Test Backend Directly

Try these URLs in your browser:

1. **Root endpoint**: `https://your-backend-url.onrender.com/`
2. **Health check**: `https://your-backend-url.onrender.com/api/health`

Expected response:

```json
{
  "status": "ok",
  "message": "UPI CryptoConnect Backend is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Step 3: Check Frontend Configuration

1. **Go to your Vercel dashboard**
2. **Check environment variables**:
   - `VITE_BACKEND_URL` should be your Render backend URL
   - Format: `https://your-backend-url.onrender.com`

### Step 4: Test API Connection

Open browser developer tools (F12) and run:

```javascript
// Test if backend is reachable
fetch("https://your-backend-url.onrender.com/")
  .then((response) => response.json())
  .then((data) => console.log("Backend response:", data))
  .catch((error) => console.error("Backend error:", error));
```

### Step 5: Common Issues & Solutions

#### Issue 1: Backend Not Deployed

- **Symptom**: 404 on backend URL
- **Solution**: Check Render logs, redeploy backend

#### Issue 2: Wrong Backend URL

- **Symptom**: Frontend can't connect
- **Solution**: Update `VITE_BACKEND_URL` in Vercel

#### Issue 3: CORS Error

- **Symptom**: CORS error in browser console
- **Solution**: Update `FRONTEND_URL` in Render environment variables

#### Issue 4: Environment Variables Missing

- **Symptom**: Backend starts but API calls fail
- **Solution**: Check all required environment variables in Render

### Step 6: Environment Variables Checklist

**Render (Backend) Environment Variables:**

```
NODE_ENV=production
PORT=1000
NODE_VERSION=16.20.0
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CURRENCY_API_KEY=your_currency_api_key
CRYPTO_API_KEY=your_crypto_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Vercel (Frontend) Environment Variables:**

```
VITE_BACKEND_URL=https://your-backend-url.onrender.com
```

### Step 7: Quick Fix Commands

If backend deployment fails:

```bash
# Push latest changes
git add .
git commit -m "Fix deployment issues"
git push origin main

# Check Render logs for errors
# Redeploy if needed
```

### Step 8: Test Complete Flow

1. **Backend health**: Visit backend URL directly
2. **Frontend load**: Visit frontend URL
3. **API calls**: Try login/register in frontend
4. **Check console**: Look for any errors

### Step 9: Get Help

If still having issues:

1. **Check Render logs** for specific error messages
2. **Check Vercel build logs** for frontend issues
3. **Share error messages** for specific help
4. **Check browser console** for client-side errors

## Quick Status Check

Run this in browser console on your frontend:

```javascript
// Test backend connection
async function testBackend() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    console.log("✅ Backend connected:", data);
  } catch (error) {
    console.error("❌ Backend connection failed:", error);
  }
}

testBackend();
```
