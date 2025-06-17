# Manual Vercel Deployment Guide

## If Automatic Deployment Fails

Since the automatic deployment is having issues with PostCSS, try manual deployment:

### Step 1: Go to Vercel Dashboard

1. Visit [vercel.com](https://vercel.com)
2. Sign in to your account
3. Click "New Project"

### Step 2: Import Your Repository

1. Connect your GitHub account if not already connected
2. Select your `upi-cryptoconnect` repository
3. Click "Import"

### Step 3: Configure Project Settings

**Important Settings:**

- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Environment Variables

Add this environment variable:

- **Name**: `VITE_BACKEND_URL`
- **Value**: Your Render backend URL (e.g., `https://your-app.onrender.com`)

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Check the build logs for any errors

## Alternative: Use Fallback Config

If manual deployment also fails, try using the fallback config:

1. Rename `vercel-fallback.json` to `vercel.json`
2. Push the changes
3. Try deployment again

## Troubleshooting

### If Build Still Fails:

1. **Check Build Logs**: Look for specific error messages
2. **Try Different Node Version**: Set Node.js version to 18.x in Vercel
3. **Remove All Scripts**: Try building without any custom scripts
4. **Use CDN Tailwind**: Add Tailwind CDN to index.html instead of npm

### Quick Fix Commands:

```bash
# If you need to test locally first
cd client
npm install
npm run build

# If local build works, push changes
git add .
git commit -m "Manual deployment ready"
git push origin main
```

## Expected Result

After successful deployment:

- Frontend should be accessible at your Vercel URL
- Backend should be accessible at your Render URL
- API calls should work between frontend and backend
