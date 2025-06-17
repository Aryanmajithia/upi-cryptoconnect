# Troubleshooting Guide

## Common Issues and Solutions

### 1. gOPD Module Error

**Error**: `Cannot find module './gOPD'`

**Cause**: This is typically caused by corrupted node_modules or dependency conflicts.

**Solutions**:

#### Option A: Clean Install (Recommended)

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

#### Option B: Use npm ci

```bash
cd backend
rm -rf node_modules package-lock.json
npm ci
```

#### Option C: Clear npm cache

```bash
npm cache clean --force
cd backend
rm -rf node_modules package-lock.json
npm install
```

### 2. Render Deployment Issues

#### Build Failures

1. **Check Render Logs**: Go to your service → "Logs" tab
2. **Verify Build Command**: Should be `cd backend && rm -rf node_modules package-lock.json && npm ci --production`
3. **Check Node Version**: Ensure you're using Node.js 16+ (specified in package.json)

#### Environment Variables

1. **Verify All Variables**: Ensure all required environment variables are set
2. **Check Variable Names**: Ensure no typos in variable names
3. **Update FRONTEND_URL**: After Vercel deployment, update this in Render

### 3. Vercel Deployment Issues

#### Build Failures

1. **Check Build Logs**: Go to your project → "Deployments" → "Functions"
2. **Verify Root Directory**: Should be set to `client`
3. **Check Build Command**: Should be `npm run build`

#### Environment Variables

1. **Set VITE_BACKEND_URL**: Must point to your Render backend URL
2. **Format**: Should be `https://your-app.onrender.com`

### 4. Database Connection Issues

#### MongoDB Atlas

1. **Check Connection String**: Verify it's correct and includes database name
2. **IP Whitelist**: Add `0.0.0.0/0` to allow all IPs (for Render)
3. **User Permissions**: Ensure database user has read/write access

### 5. CORS Errors

#### Frontend Can't Connect to Backend

1. **Check FRONTEND_URL**: Must be exactly your Vercel domain
2. **Include Protocol**: Must include `https://`
3. **Redeploy Backend**: After updating FRONTEND_URL, backend will auto-redeploy

### 6. API Key Issues

#### Missing or Invalid API Keys

1. **Currency API**: Get from a currency conversion service
2. **Crypto API**: Get from a cryptocurrency data provider
3. **Razorpay**: Get from Razorpay dashboard (for UPI payments)

## Debugging Steps

### 1. Check Application Logs

#### Render (Backend)

```bash
# View real-time logs
# Go to Render dashboard → Your service → Logs tab
```

#### Vercel (Frontend)

```bash
# View build and function logs
# Go to Vercel dashboard → Your project → Deployments → Functions
```

### 2. Test API Endpoints

#### Using curl

```bash
# Test backend health
curl https://your-backend.onrender.com/

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" https://your-backend.onrender.com/api/user
```

### 3. Browser Developer Tools

1. **Console**: Check for JavaScript errors
2. **Network**: Verify API requests are reaching the backend
3. **Application**: Check localStorage for tokens

## Common Environment Variables

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
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)

```env
VITE_BACKEND_URL=https://your-backend.onrender.com
```

## Performance Optimization

### 1. Render Optimization

- **Auto-sleep**: Free tier services sleep after 15 minutes of inactivity
- **Cold starts**: First request after sleep may be slow
- **Upgrade**: Consider paid plan for always-on service

### 2. Vercel Optimization

- **CDN**: Automatic global CDN for fast loading
- **Caching**: Static assets are cached automatically
- **Edge Functions**: Available on paid plans

## Security Checklist

- [ ] JWT_SECRET is strong and random (32+ characters)
- [ ] API keys are kept secure and not in code
- [ ] HTTPS is enabled (automatic on both platforms)
- [ ] CORS is properly configured
- [ ] Database has proper authentication
- [ ] Environment variables are not committed to git

## Getting Help

1. **Check this guide** for common solutions
2. **Review platform documentation**:
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
3. **Check GitHub issues** for similar problems
4. **Contact platform support** if needed

## Quick Fix Commands

```bash
# Local testing
cd backend && npm run clean-install
cd ../client && npm install

# Check if backend runs locally
cd backend && npm start

# Check if frontend builds
cd client && npm run build
```
