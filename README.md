# Chantara Thai Massage

Modern website for Chantara Thai Massage (Fulham, London) — React + Vite + Tailwind CSS.

## Project structure

```
.
├── index.html          # Root HTML entry (required by Vite)
├── package.json
├── vite.config.ts
├── vercel.json
├── public/
│   └── logo.png
└── src/
    ├── main.tsx        # JS entry referenced by index.html
    ├── App.tsx
    ├── index.css
    ├── data.ts
    ├── assets/
    └── components/
```

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deploy to GitHub + Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Chantara Thai Massage site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the GitHub repository
   - Settings (auto-detected from `vercel.json`):
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`
     - **Root Directory:** leave blank (repo root)
   - Click **Deploy**

3. If you still see `Failed to resolve ./src/main.tsx`:
   - Confirm `index.html` is at the **repository root** (not inside a subfolder)
   - Confirm `src/main.tsx` exists in the repo
   - In Vercel Project Settings → General → Root Directory, leave it empty or set to `.`
