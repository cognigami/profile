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

## Hero motion

The landing page's live illustration and animation are inline in `src/pages/index.astro`;
`public/hero.svg` is not the live source. Breathing defaults to **4.5× strength / 85% speed**.
It blends into the scroll morph, pauses offscreen or in a hidden tab, and respects
reduced-motion preferences.

Motion study controls are hidden by default. Append `?motion-study=1` to the landing
page URL to compare Original/Breathing and adjust strength and speed. Readouts show
exact values to report; adjustments apply only to the current page session and do
not change the saved defaults.

The separate **Sand light** experiment is off by default, including in Motion study.
Enable its checkbox, then choose an approach:
- **Landscape wind** (initial selection): small patches on the actual cream, gold,
  terracotta, and amber contours release sand into a shared billowing wind field.
  Nearby grains follow the same eddies; patches respond to spatially related gusts
  rather than a single advancing front. Grains use muted ochre/brown variants of their
  source layer's colour, with rare, soft amber light catches rather than white glints.
  Longer airborne lives, stronger shared eddies, and stable differences in grain
  buoyancy/response give wisps more spread without per-frame jitter. Visibility is
  carried primarily by more matte grains, not brighter highlights; strength values
  are specific to this tuning rather than comparable to earlier revisions. The artwork
  does not erode. Lower source curves follow the current breathing/scroll geometry.
  `src/scripts/landscape-wind.ts` owns emission and advection on the shared canvas;
  it uses the hero's clock, crop, offscreen pause, and reduced-motion handling.
- **Airborne sand plume**: a transparent canvas layer of fine
  moving grains forms a thin, uneven plume with trailing wisps. A few of those same
  traveling grains briefly catch warm light. The plume crosses and disperses beyond
  the frame before another enters; it does not reveal or deform a sandy surface.
  Rendering lives in `src/scripts/sand-plume.ts`, uses the hero's existing clock,
  matches the SVG crop, and stays underneath the text-contrast scrim. Particle data
  is seeded and created only when this approach is first enabled.
- **Passing sand wash**: the first broad wash's exact path and
  cadence reveal a localized sandy texture. The envelope has dry, uneven density;
  matte relief and small facet catches appear within it. The material stays anchored
  and fades back into the artwork as the wash passes, without grains snapping back.
  The original smooth colored sheen and isolated-flecks layer are not used.
- **Windblown veil**: a continuous fine-grained wash drifts slowly
  sideways/upward over the illustration. Matte shading and restrained facet catches
  come from the same stitched grain height field and move together.
- **Fixed sandy surface**: the same granular material stays anchored; slowly changing
  directional light reveals its relief and occasional facet highlights.
- **Grain catches only**: the earlier isolated-flecks experiment, retained for comparison.
- **Broad wash**: the earlier smooth moving sheen, retained for comparison.

The three material approaches use diffuse lighting for dry grain relief, a small
specular contribution for catches, and soft-light blending under the unchanged
vignette/scrim. Passing sand wash localizes this material to a moving, broken-density
envelope; the other two show material across the whole header.

Sand strength ranges from 0–4× (starts at 1×); report the approach and this value
separately from breathing strength/speed. Sand timing is independent of breathing
speed. All sand approaches pause offscreen/in hidden tabs with the hero. Original
mode and reduced motion suppress all sand approaches; reload resets
sand light to off. None of the experiments change the approved breathing defaults.

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
