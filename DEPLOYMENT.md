# 🚀 Deployment Guide

This guide will walk you through deploying your Cellulite Reduction Tracker to Railway (backend) and Vercel (frontend).

---

## Prerequisites

- GitHub account
- Railway account (https://railway.app - sign up with GitHub)
- Vercel account (https://vercel.com - sign up with GitHub)

---

## Step 1: Push Code to GitHub

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it: `cellulite-tracker`
   - Keep it **private** (recommended for personal data)
   - **DO NOT** initialize with README (we already have one)

2. Push your code to GitHub:

```bash
cd /Users/marisha/cellulite-tracker

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete cellulite tracker application"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cellulite-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your `cellulite-tracker` repository
6. Railway will detect it's a monorepo

### 2.2 Configure Backend Service

1. Railway may auto-detect the backend, if not:
   - Click "Add Service"
   - Select "GitHub Repo"
   - Choose your repository

2. Set the **Root Directory**:
   - Click on your service
   - Go to "Settings"
   - Set **Root Directory** to: `backend`

3. Set **Build Command**:
   - In Settings, find "Build Command"
   - Set to: `npm install && npm run build`

4. Set **Start Command**:
   - In Settings, find "Start Command"
   - Set to: `npm start`

### 2.3 Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a database
4. The `DATABASE_URL` will be automatically set in your backend service

### 2.4 Set Environment Variables

1. Click on your backend service
2. Go to "Variables" tab
3. Add the following variables:

```
NODE_ENV=production
JWT_SECRET=your-super-secure-random-secret-key-change-this
PORT=5000
```

**Important**: Generate a strong JWT_SECRET:
```bash
# Run this in your terminal to generate a random secret
openssl rand -base64 32
```

### 2.5 Deploy & Get Backend URL

1. Railway will automatically deploy
2. Go to "Settings" → "Networking"
3. Click "Generate Domain"
4. Copy your backend URL (e.g., `https://your-app.up.railway.app`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your `cellulite-tracker` repository
4. Vercel will detect it's a monorepo

### 3.2 Configure Frontend Service

1. **Framework Preset**: Vite
2. **Root Directory**: Set to `frontend`
3. **Build Command**: `npm run build` (should be auto-detected)
4. **Output Directory**: `dist` (should be auto-detected)
5. **Install Command**: `npm install`

### 3.3 Set Environment Variables

1. Before deploying, add environment variable:
2. Click "Environment Variables"
3. Add:

```
Name: VITE_API_URL
Value: https://your-backend-url.up.railway.app/api
```

Replace `your-backend-url.up.railway.app` with your actual Railway backend URL from Step 2.5

### 3.4 Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. You'll get a URL like: `https://cellulite-tracker.vercel.app`

---

## Step 4: Update Backend CORS

After deploying frontend, update your backend to allow requests from Vercel:

1. Go to Railway → Your backend service → Variables
2. Add new variable:

```
FRONTEND_URL=https://your-frontend.vercel.app
```

3. Update `backend/src/server.ts` to use this variable:

Currently the backend has:
```typescript
app.use(cors());
```

For production, you should update it to:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

**Note**: I can make this change for you now if you'd like, or you can make it after deployment and redeploy.

---

## Step 5: Test Your Deployed Application

1. Visit your Vercel URL: `https://cellulite-tracker.vercel.app`
2. Register a new account
3. Test all features:
   - Daily habits
   - Workout logging
   - Photo uploads
   - Dashboard analytics

---

## Important Notes

### Database
- Railway PostgreSQL is used in production
- Database automatically backed up by Railway
- Run migrations: In Railway service, go to "Settings" and you can run commands

### File Uploads
- Photos are stored on Railway's filesystem
- For production at scale, consider using AWS S3 or Cloudinary
- Current setup works fine for personal/small team use

### Free Tier Limits
- **Railway**: $5 free credit per month (usually enough for small apps)
- **Vercel**: Free for hobby projects with generous limits

### Domain (Optional)
- **Vercel**: Can add custom domain in project settings
- **Railway**: Can add custom domain in service settings

---

## Troubleshooting

### Backend Issues:
- Check Railway logs: Service → "Deployments" → Click latest → "View Logs"
- Ensure all environment variables are set
- Verify DATABASE_URL is automatically provided by Railway

### Frontend Issues:
- Check Vercel logs in deployment details
- Verify `VITE_API_URL` points to Railway backend
- Check browser console for API connection errors

### Database Migration:
If you need to run migrations on Railway:
1. Go to your backend service
2. Click "Settings" → "Deploy"
3. Add deploy command: `npm run prisma:migrate:deploy`

---

## Quick Deploy Checklist

- [ ] Push code to GitHub
- [ ] Create Railway project and deploy backend
- [ ] Add PostgreSQL database on Railway
- [ ] Set environment variables on Railway (JWT_SECRET, NODE_ENV)
- [ ] Get Railway backend URL
- [ ] Create Vercel project and deploy frontend
- [ ] Set VITE_API_URL on Vercel to Railway backend URL
- [ ] Update CORS in backend (optional but recommended)
- [ ] Test the deployed application

---

## Next Steps After Deployment

1. **Test thoroughly** - Create test account and verify all features
2. **Monitor Railway logs** - Check for any errors
3. **Set up custom domain** (optional)
4. **Share with users** - Start tracking!

---

Would you like me to update the CORS configuration in the backend now for better production security?
