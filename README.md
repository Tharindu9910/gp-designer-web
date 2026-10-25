# Uditha Saumya — Graphic Designer portfolio

Next.js 15 (App Router) + Tailwind v4 + GSAP/Lenis.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Content
- `content/site.ts` — name, contact, socials, stats, home copy. **Email, WhatsApp and social links are placeholders marked `// TODO`.**
- `content/about.ts` — About page: intro, services, approach, journey.
- `content/projects.ts` — the nine works (case studies and collections).

## Images
All work images are cut from the portfolio deck screenshots in `assets/` by:

```bash
node scripts/crop-assets.mjs          # writes public/images/** and content/media.generated.ts
node scripts/crop-assets.mjs --sheet  # also writes a labelled contact sheet (crop-sheet-*.jpg)
bash scripts/gen-reel.sh              # rebuilds the home showreel from the crops
```

The screenshots are low resolution, so layouts cap image sizes. To use high-res originals,
change the matching entry in the `crops` manifest at the top of `scripts/crop-assets.mjs`
(source slide, box and scale) and re-run; components read sizes from `media.generated.ts`.
