# Deployment Guide - GitHub + Cloudflare

## Step 1: Push to GitHub

```bash
cd C:/SAPDevelop/DadBirthday
git add .
git commit -m "Initial commit - The Quantum Observer"
git branch -M main
git remote add origin https://github.com/SeanBissell/quantum-observer-story.git
git push -u origin main
```

## Step 2: Deploy Cloudflare Worker (Backend)

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Click "Create Application" → "Create Worker"
4. Name it: `quantum-observer-api`
5. Click "Deploy"
6. Click "Edit Code"
7. Copy contents of `worker.js` and paste into the editor
8. Click "Save and Deploy"
9. Go to "Settings" → "Variables"
10. Add environment variable:
    - Name: `MINIMAX_API_KEY`
    - Value: (your MiniMax API key from server.js line 9)
    - Encrypt: Yes
11. Click "Save"

Your worker will be at: `https://quantum-observer-api.YOUR-SUBDOMAIN.workers.dev`

## Step 3: Deploy Cloudflare Pages (Frontend)

1. Go to https://dash.cloudflare.com
2. Click "Workers & Pages"
3. Click "Create Application" → "Pages" → "Connect to Git"
4. Select "GitHub" and authorize
5. Select repository: `SeanBissell/quantum-observer-story`
6. Configure:
   - Production branch: `main`
   - Build command: (leave empty)
   - Build output directory: `/`
7. Click "Save and Deploy"
8. Wait for deployment (~2 minutes)
9. Your site will be at: `https://quantum-observer-story.pages.dev`
10. (Optional) Add custom domain: `story.seanbissell.com`

## Step 4: Create iframe on seanbissell.com/dad

1. Log into your HostGator cPanel
2. Go to File Manager
3. Navigate to `public_html`
4. Create a new folder called `dad`
5. Inside the `dad` folder, create `index.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Quantum Observer</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100vh;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="https://quantum-observer-story.pages.dev" allow="fullscreen"></iframe>
</body>
</html>
```

6. Save the file
7. Visit `https://seanbissell.com/dad`

## Done!

Your story will be live at:
- Direct: `https://quantum-observer-story.pages.dev`
- Iframe: `https://seanbissell.com/dad`

The backend API will handle the MiniMax key securely, and Cloudflare will automatically deploy updates whenever you push to GitHub!
