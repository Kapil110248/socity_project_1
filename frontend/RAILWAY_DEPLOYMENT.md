# 🚂 Deploy to Railway - Simple Steps

## Quick Deployment (3 Steps)

### Step 1: Push Your Code (Already Done! ✅)
```bash
git push origin main
```

### Step 2: Deploy on Railway

#### Option A: Using Railway Dashboard (Easiest)
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Click **"Deploy from GitHub repo"**
4. Select: `maanisingh/society-management-system`
5. Railway will auto-detect Next.js and deploy!

#### Option B: Using Railway CLI
```bash
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login to Railway
railway login

# Link project (or create new)
railway link

# Deploy
railway up
```

### Step 3: Set Environment Variables (Important!)

In Railway Dashboard → Your Project → Variables:

```env
# Required for Next.js
NODE_ENV=production

# If you have API URLs
NEXT_PUBLIC_API_URL=https://your-api.com

# Any other environment variables your app needs
```

---

## 🎯 Railway Configuration

Railway will automatically:
- ✅ Detect Next.js
- ✅ Install dependencies (`npm install`)
- ✅ Build your app (`npm run build`)
- ✅ Start the server (`npm start`)

### Build Settings (Auto-detected):
```
Build Command: npm run build
Start Command: npm start
Port: 3000 (auto-assigned by Railway)
```

---

## 🔧 Advanced: Custom Railway Config (Optional)

If you need custom settings, create `railway.toml`:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

---

## 📝 Deployment Checklist

Before deploying, ensure:

- [ ] Code pushed to GitHub: ✅ DONE
- [ ] `package.json` has correct scripts:
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    }
  }
  ```
- [ ] No hardcoded localhost URLs (use env variables)
- [ ] All dependencies in `package.json`

---

## 🚀 Deployment Commands

```bash
# See deployment logs
railway logs

# Check deployment status  
railway status

# Open your deployed app
railway open

# See environment variables
railway variables
```

---

## 🌐 After Deployment

### Your app will be live at:
```
https://society-management-xxxx.railway.app
```

### Custom Domain (Optional):
1. Go to Railway Dashboard → Settings → Domains
2. Click "Generate Domain" or add custom domain
3. Point your DNS to Railway

---

## 🐛 Troubleshooting

### Build Fails?
```bash
# Check logs
railway logs

# Common fixes:
# 1. Make sure all dependencies are in package.json
# 2. Check if build works locally: npm run build
# 3. Verify Node version compatibility
```

### App Not Starting?
```bash
# Check if start command is correct
railway logs

# Make sure you have:
# - "start": "next start" in package.json
# - Next.js production build completed
```

### Environment Variables Not Working?
1. Go to Railway Dashboard → Variables
2. Add variables WITHOUT quotes
3. Redeploy after adding variables

---

## 💡 Railway Benefits

✅ **Free Tier**: $5 credit/month (perfect for small projects)
✅ **Auto-Deploy**: Pushes to GitHub auto-deploy
✅ **HTTPS**: SSL certificate included
✅ **Fast**: Global CDN
✅ **Easy**: No Docker/config needed

---

## 🎉 That's It!

Your society management system is now:
- ✅ Pushed to GitHub
- ✅ Ready to deploy on Railway
- ✅ Role-based access control working
- ✅ Mobile responsive
- ✅ Production ready!

**Just click "Deploy" on Railway and you're live! 🚀**

