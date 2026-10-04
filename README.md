# Neighbours from Hell: Nainital Family Edition 😈🏡

A complete, polished, and fully playable mobile-web stealth/prank puzzle game inspired by the classic **“Neighbours from Hell”** gameplay loop.

Built for **Mobile Web (Landscape: 1280 × 720)** with 100% original artwork, characters, audio synthesis, and level design.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000/](http://localhost:3000/) (or the next available port shown in your terminal).

### 3. Production Build
```bash
npm run build
```
Generates a minified production bundle in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```
Serves the production bundle locally at [http://localhost:4173/](http://localhost:4173/).

---

## ☁️ Deploying to Vercel

This repository is pre-configured with [`vercel.json`](./vercel.json) for automatic deployment.

### Option A: Deploy via GitHub (Recommended)
1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Vercel will automatically detect the **Vite** preset:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

### Option B: Deploy via Vercel CLI
```bash
npx vercel
# For production deployment:
npx vercel --prod
```

---

## 🧪 Automated Testing

Run the full end-to-end headless Chrome test suite:

```bash
# Test gameplay flow & orientation guard:
node test_game.cjs

# Test production build served from localhost:4173:
node test_production_build.cjs
```

---

## 🎮 Game Features

- **Harmless Slapstick Comedy:** Harmless family pranks (salty tea, glued slippers, whoopee cushion, green face cream, loud radio).
- **10 Original Avatars:** Chintu, Pooja, Bunty, Rocky, Golu, Simran, Chacha Ji, Tinku, Nikki, Karan.
- **5 Unique Houses & Residents:** Mama, Guddi Mausi, Pammi Mausi, Beena Mausi, Manju Mausi.
- **10 Playable Levels:** Progressive objectives across all 5 houses.
- **Picture-in-Picture (PiP) Resident Cam:** Live CRT monitor showing the resident's current room.
- **Zero-Dependency Web Audio Synthesizer:** Slapstick SFX, footsteps, reactions, and sneaky swing BGM.
- **LocalStorage Progression:** Star ratings, scores, and unlocked levels.
