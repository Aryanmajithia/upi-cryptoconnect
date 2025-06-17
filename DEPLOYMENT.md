# Deployment Guide - UPI CryptoConnect

This guide will help you deploy your UPI CryptoConnect application to production.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **MongoDB Atlas Account** - For database hosting
3. **Vercel Account** - For frontend deployment (free tier available)
4. **Railway Account** - For backend deployment (free tier available)

## Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)

## Step 2: Backend Deployment (Railway)

### Option A: Deploy via Railway Dashboard

1. Go to [Railway](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select your repository
4. Set the root directory to `backend`
5. Add environment variables:
   ```
   PORT=1000
   NODE_ENV=production
   MONGO_URL=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   CURRENCY_API_KEY=your_currency_api_key
   CRYPTO_API_KEY=your_crypto_api_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```
6. Deploy the project
7. Copy the generated domain (e.g., `https://your-app.railway.app`)

### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
railway init

# Deploy
railway up
```

## Step 3: Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com) and sign up
2. Click "New Project" → "Import Git Repository"
3. Connect your GitHub account and select your repository
4. Set the root directory to `client`
5. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables:
   ```
   VITE_BACKEND_URL=https://your-backend-domain.railway.app
   ```
7. Deploy the project
8. Copy the generated domain (e.g., `https://your-app.vercel.app`)

## Step 4: Update Backend CORS

After getting your frontend domain, update the backend environment variable:

1. Go to your Railway project dashboard
2. Navigate to Variables tab
3. Update `FRONTEND_URL` with your Vercel domain
4. Redeploy the backend

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test user registration and login
3. Test all major features
4. Check console for any errors

## Environment Variables Reference

### Backend (.env)

```env
PORT=1000
NODE_ENV=production
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_secure_jwt_secret
CURRENCY_API_KEY=your_currency_api_key
CRYPTO_API_KEY=your_crypto_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend (.env)

```env
VITE_BACKEND_URL=https://your-backend-domain.railway.app
```

## Alternative Deployment Options

### Render (Alternative to Railway)

- Similar to Railway
- Free tier available
- Good for Node.js applications

### Netlify (Alternative to Vercel)

- Similar to Vercel
- Free tier available
- Good for React applications

### Heroku (Alternative to Railway)

- More established platform
- Paid service
- Good for production applications

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` is correctly set in backend
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **Build Failures**: Check if all dependencies are in package.json
4. **Environment Variables**: Ensure all required variables are set

### Debugging:

1. Check Railway logs for backend errors
2. Check Vercel build logs for frontend errors
3. Use browser developer tools to check network requests
4. Verify API endpoints are accessible

## Security Considerations

1. Use strong JWT secrets
2. Keep API keys secure
3. Use HTTPS in production
4. Regularly update dependencies
5. Monitor application logs

## Cost Estimation

- **Vercel**: Free tier (100GB bandwidth, 100GB storage)
- **Railway**: Free tier (500 hours/month, 1GB storage)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month for basic usage

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review platform documentation
3. Check GitHub issues
4. Contact platform support
