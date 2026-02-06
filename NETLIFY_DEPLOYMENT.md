# Netlify Deployment Guide

## ✅ Files Created for Netlify

1. **`netlify.toml`** - Netlify configuration file
2. **`client/_redirects`** - Redirect rules for client-side routing

## 🚀 Deployment Steps

### Step 1: Frontend Deployment (Netlify)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Netlify configuration files"
   git push origin main
   ```

2. **In Netlify Dashboard:**
   - Go to your site settings
   - Build & deploy → Build settings
   - **Publish directory:** `client`
   - **Build command:** (leave empty or use `echo "No build needed"`)
   - Save

3. **Redeploy:**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

### Step 2: Backend Deployment (Required for Full Functionality)

**⚠️ Important:** Netlify only hosts static files. Your Node.js backend needs to be deployed separately.

#### Option A: Render (Recommended - Free Tier)

1. Go to https://render.com
2. Sign up/login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** `mindnest-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** (leave empty)
6. Add Environment Variables:
   - Copy all variables from your `.env` file:
     ```
     PORT=3000
     DB_HOST=your-db-host
     DB_USER=your-db-user
     DB_PASSWORD=your-db-password
     DB_NAME=mindnest
     JWT_SECRET=your-jwt-secret
     NODE_ENV=production
     CLIENT_URL=https://your-netlify-site.netlify.app
     ```
7. Click "Create Web Service"
8. Wait for deployment (takes 5-10 minutes)
9. Copy your backend URL (e.g., `https://mindnest-backend.onrender.com`)

#### Option B: Railway (Alternative - Free Tier)

1. Go to https://railway.app
2. Sign up/login
3. "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as Render)
6. Deploy
7. Get your backend URL

### Step 3: Update Frontend Config

After deploying your backend, update `client/js/config.js`:

```javascript
export const API_BASE_URL = isProduction 
  ? 'https://your-backend-url.onrender.com/api' // Replace with your actual backend URL
  : 'http://localhost:3000/api';
```

Then commit and push:
```bash
git add client/js/config.js
git commit -m "Update API URL for production"
git push origin main
```

Netlify will auto-deploy the changes.

## 🔧 Troubleshooting

### Issue: 404 Error on Netlify

**Solution:**
- Make sure `netlify.toml` exists in root directory
- Make sure `client/_redirects` exists
- Verify publish directory is set to `client` in Netlify settings
- Clear cache and redeploy

### Issue: API Calls Failing

**Solution:**
- Backend must be deployed separately (Render/Railway)
- Update `API_BASE_URL` in `config.js` with your backend URL
- Check CORS settings in your backend (`server/app.js`)
- Ensure `CLIENT_URL` environment variable in backend matches your Netlify URL

### Issue: CORS Errors

**Solution:**
- In your backend `.env` on Render/Railway, set:
  ```
  CLIENT_URL=https://your-netlify-site.netlify.app
  ```
- Restart your backend service

## 📝 Current Status

- ✅ Netlify configuration files created
- ✅ Frontend ready for static deployment
- ⚠️ Backend needs separate deployment (Render/Railway)
- ⚠️ Update `config.js` with backend URL after deployment

## 🎯 Quick Test

1. Deploy frontend on Netlify (should work now)
2. Deploy backend on Render/Railway
3. Update `config.js` with backend URL
4. Test login/signup functionality

---

**Note:** For hackathon demo purposes, you can:
- Show the frontend working on Netlify
- Mention that backend is deployed separately
- Or run backend locally and use ngrok for demo

