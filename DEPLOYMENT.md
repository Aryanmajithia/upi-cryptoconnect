# Deployment Guide - UPI CryptoConnect (Vercel + Render)

This guide will help you deploy your UPI CryptoConnect application using **Vercel** for frontend and **Render** for backend.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **MongoDB Atlas Account** - For database hosting (free tier)
3. **Vercel Account** - For frontend deployment (free tier)
4. **Render Account** - For backend deployment (free tier)

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)

## Step 2: Backend Deployment (Render)

### Option A: Deploy via Render Dashboard

1. Go to [Render](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub account and select your repository
4. Configure the service:
   - **Name**: `upi-cryptoconnect-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
5. Add environment variables (from `backend/env.render`):
   ```
   NODE_ENV=production
   PORT=1000
   MONGO_URL=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   CURRENCY_API_KEY=your_currency_api_key
   CRYPTO_API_KEY=your_crypto_api_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```
6. Click "Create Web Service"
7. Copy the generated domain (e.g., `https://your-app.onrender.com`)

### Option B: Deploy via render.yaml

1. The `render.yaml` file is already configured
2. Render will automatically detect and use this configuration
3. Just connect your GitHub repo and deploy

## Step 3: Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "New Project" → "Import Git Repository"
3. Connect your GitHub account and select your repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   ```
   VITE_BACKEND_URL=https://your-backend-domain.onrender.com
   ```
6. Click "Deploy"
7. Copy the generated domain (e.g., `https://your-app.vercel.app`)

## Step 4: Update Backend CORS

After getting your frontend domain, update the backend environment variable:

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL` with your Vercel domain
5. Click "Save Changes" (this will trigger a redeploy)

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test user registration and login
3. Test all major features
4. Check browser console for any errors
5. Check Render logs for backend errors

## Environment Variables Reference

### Backend (Render)

```env
NODE_ENV=production
PORT=1000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_jwt_secret
CURRENCY_API_KEY=your_currency_api_key
CRYPTO_API_KEY=your_crypto_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (Vercel)

```env
VITE_BACKEND_URL=https://your-backend-domain.onrender.com
```

## Platform-Specific Features

### Render Benefits:

- **Free Tier**: 750 hours/month
- **Auto-deploy**: Deploys on every git push
- **Custom domains**: Available on paid plans
- **SSL**: Automatic HTTPS
- **Logs**: Real-time application logs

### Vercel Benefits:

- **Free Tier**: 100GB bandwidth, 100GB storage
- **Auto-deploy**: Deploys on every git push
- **Custom domains**: Available on free tier
- **SSL**: Automatic HTTPS
- **Edge Functions**: Available on paid plans

## Troubleshooting

### Common Issues:

1. **CORS Errors**:

   - Make sure `FRONTEND_URL` is correctly set in Render
   - Check that the URL includes `https://`

2. **Database Connection**:

   - Verify MongoDB Atlas connection string
   - Check if IP whitelist includes Render's IPs

3. **Build Failures**:

   - Check if all dependencies are in package.json
   - Verify build commands are correct

4. **Environment Variables**:
   - Ensure all required variables are set in both platforms
   - Check for typos in variable names

### Debugging:

1. **Render Logs**: Go to your service → "Logs" tab
2. **Vercel Logs**: Go to your project → "Deployments" → "Functions" tab
3. **Browser Console**: Check for frontend errors
4. **Network Tab**: Verify API requests are reaching the backend

## Cost Estimation

- **Vercel**: Free tier (100GB bandwidth, 100GB storage)
- **Render**: Free tier (750 hours/month)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month for basic usage

## Security Best Practices

1. **JWT Secret**: Use a strong, random string (32+ characters)
2. **API Keys**: Keep them secure and rotate regularly
3. **Environment Variables**: Never commit them to git
4. **HTTPS**: Both platforms provide automatic SSL
5. **Database**: Use MongoDB Atlas with proper authentication

## Monitoring

### Render Monitoring:

- **Logs**: Real-time application logs
- **Metrics**: CPU, memory usage
- **Health Checks**: Automatic health monitoring

### Vercel Monitoring:

- **Analytics**: Page views, performance
- **Functions**: Serverless function metrics
- **Deployments**: Build and deployment history

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **GitHub Issues**: For code-specific problems

## Quick Deploy Checklist

- [ ] MongoDB Atlas database created
- [ ] GitHub repository pushed with all changes
- [ ] Render backend service created and configured
- [ ] Vercel frontend project created and configured
- [ ] Environment variables set in both platforms
- [ ] CORS updated with frontend URL
- [ ] Application tested end-to-end
- [ ] Custom domain configured (optional)
