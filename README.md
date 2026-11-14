# Spec Shootout

Compare cameras, action & 360 cameras, drones and gimbals — spec by spec, frame rate by frame rate.

## What's inside

| Page | What it does |
| --- | --- |
| **Home** | Search any device, jump into a section, or start the gear finder. |
| **Cameras / Action & 360 / Drones / Gimbals** | Browse every product with filters, scores and a frame-rate finder. |
| **Product page** | Full specs, every video mode with its crop, score breakdown. |
| **Versus** | Compare up to four devices: upgrade verdict or ranking, scores, every spec, frame-rate face-off. **Download the comparison as a PDF or JPEG.** |
| **Gear paths** | Complete kits (body, lenses, audio, support…) from first gear to world-class, for photo, video, hybrid, action/BTS and drone pilots — including cheap used classics. |
| **Finder** | A short quiz (what you make, hybrid lean, budget, new/used, what you shoot, size) that recommends a best match and two alternatives. |

Built with **React 18 + TypeScript + Vite**, animated with **GSAP** (ScrollTrigger, SplitText). Motion respects `prefers-reduced-motion`.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

```bash
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Project layout

```
src/
  App.tsx              routes (hash-based: #/cameras, #/vs/a/b, #/finder …) and header
  components/          one file per page (Home, Browse, Detail, Versus, Kits, Finder…) + shared bits
  data/                all product data (cameras by brand, drones, gimbals, gear-path kits)
    photos.json        product photo URLs and their source
  lib/
    scoring.ts         how photo / video / flight scores are calculated
    verdict.ts         upgrade / sidegrade / skip logic for Versus
    finder.ts          the quiz recommendation logic
    exporter.ts        PDF / JPEG export of a comparison
    motion.ts, director.ts   GSAP setup and page choreography
  styles.css, motion.css, fx.css, fx-home.css
scripts/               helper scripts used to collect product photos and logos
```

### Adding or fixing a product

Products live in `src/data/*.ts`. Each camera is built with `cam({...})`; video modes use the
string format `"label|WxH|fps|crop|quality|note"`. Run `npm run dev` and the page updates instantly.

### Photos

Product photos are **linked** from retailer and manufacturer sites (see `src/data/photos.json`);
no image files are stored in this repository. They are © their owners and used here for personal,
non-commercial reference. To use your own photo for a product, drop it in `src/assets/photos/`
named after the product id (for example `sony-a7iv.jpg`).

## Deploying (GitHub Pages)

Live site: **https://zeenstrusts.github.io/spec-shootout/**

GitHub Pages serves the `gh-pages` branch. After committing your changes, publish them with:

```bash
npm run deploy
```

That type-checks, builds into `dist/`, and pushes the build to `gh-pages`. The site updates about a minute later.

## Everyday workflow

```bash
git add -A
git commit -m "Describe what you changed"
git push          # saves the code to GitHub
npm run deploy    # updates the live site
```

## Disclaimer

Specs are compiled from manufacturer data at launch; firmware updates can add features.
Scores use this project's own formula. Always confirm with the manufacturer before buying.
