# Midaz Touch Wellness Center — Public Website

Cinematic 3D website with Ayurveda aesthetics. Connected to MIDAZ ECOSYSTEM backend.

## Deploy to Vercel (5 minutes)

### Step 1: Create GitHub Account (if you don't have one)
- Go to https://github.com
- Sign up free

### Step 2: Upload this code to GitHub
- Click "New Repository" on GitHub
- Name it: `midaz-touch-website`
- Upload all files from this folder

### Step 3: Deploy on Vercel
- Go to https://vercel.com
- Sign in with GitHub
- Click "Import Project"
- Select your `midaz-touch-website` repository
- Add environment variable: `MIDAZ_BACKEND_URL` = your server IP (e.g., `http://192.168.1.100:8000`)
- Click "Deploy"
- Your site will be live at: `https://midaz-touch-website.vercel.app`

### Step 4: Custom Domain (optional)
- Buy domain: midaztouch.com
- In Vercel > Settings > Domains > Add your domain
- Update DNS as instructed

## Local Development
```bash
npm install
npm run dev
```
Open http://localhost:3000
