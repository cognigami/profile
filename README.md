# Portfolio

Built with [Astro](https://astro.build). Static output → GitHub Pages.

## Setup

```bash
npm install
npm run dev        # localhost:4321
npm run build      # output to ./dist
npm run preview    # preview built site
```

## Deployment

Push to `main` → GitHub Actions builds and deploys to GitHub Pages.

**Before deploying:**
1. Edit `astro.config.mjs` — set `site` to your GitHub Pages URL
2. If deploying to a subpath (e.g. `username.github.io/repo-name`), uncomment and set the `base` option
3. Enable GitHub Pages in your repo settings → source: "GitHub Actions"
4. Replace `YOUR_FORM_ID` in `src/layouts/Layout.astro` with your [Formspree](https://formspree.io) form ID

## Customization checklist

- [ ] `src/layouts/Layout.astro` — replace "Your Name" throughout
- [ ] `src/pages/index.astro` — update hero headline and showcase copy
- [ ] `src/pages/cv.astro` — replace with real experience, publications, awards
- [ ] `src/pages/work/*.astro` — replace with real story copy
- [ ] `astro.config.mjs` — set your GitHub Pages site URL

## Structure

```
src/
  layouts/    Layout.astro (nav, footer, modal, scroll JS)
  pages/
    index.astro              Homepage
    cv.astro                 CV
    work/
      quantum-gaming.astro
      ml-education.astro
      docs-as-code.astro
  styles/
    global.css               All design tokens and base styles
public/
  hero.svg                   Hero background (SVG, scroll-animatable)
  favicon.svg
.github/workflows/deploy.yml GitHub Actions → GitHub Pages
```
