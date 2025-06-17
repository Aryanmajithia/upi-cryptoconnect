# Build Test Guide

## Test Build Locally First

Before deploying to Vercel, test the build locally:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Test build
npm run build
```

## If Local Build Fails

1. **Check if Tailwind CSS is installed:**

   ```bash
   npm list tailwindcss
   ```

2. **If not installed, install manually:**

   ```bash
   npm install tailwindcss@^3.3.6 autoprefixer@^10.4.16 postcss@^8.4.32
   ```

3. **Try building again:**
   ```bash
   npm run build
   ```

## Alternative: Remove Tailwind Temporarily

If Tailwind is causing issues, temporarily remove it:

1. **Comment out PostCSS config** (already done)
2. **Remove Tailwind imports from CSS files**
3. **Build without Tailwind**
4. **Add Tailwind back later**

## Vercel Deployment Steps

1. **Push changes:**

   ```bash
   git add .
   git commit -m "Fix build issues"
   git push origin main
   ```

2. **Check Vercel build logs**
3. **If still failing, try manual deployment in Vercel dashboard**

## Manual Vercel Setup

If automatic deployment fails:

1. Go to Vercel dashboard
2. Create new project from GitHub
3. Set **Root Directory** to `client`
4. Set **Framework Preset** to `Vite`
5. Set **Build Command** to `npm run build`
6. Set **Output Directory** to `dist`
7. Deploy

## Environment Variables

Don't forget to set in Vercel:

- `VITE_BACKEND_URL` = your Render backend URL
