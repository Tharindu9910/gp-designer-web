# Build Plan: "Mira Solenne" Creative Portfolio (v2: motion-matched)

A step-by-step plan for Claude Code to build a high-end, scroll-driven designer portfolio. **v2** rewrites the layout and motion sections to match the movements in a reference screen recording frame by frame: sticky stacking sections, pinned horizontal galleries, background color shifts on scroll, a footer that reveals like a curtain, and slide-up page transitions. The design and content are still **original and fictional**.

> **Ground rule for Claude Code:** Do not fetch, copy or reference assets, text, colors, fonts or code from any existing portfolio site. Recreate the *movement patterns* described here with original visuals and the fictional content below.

---

## 1. Project Summary

| Item | Decision |
|---|---|
| Persona | **Mira Solenne**, independent web & brand designer (fictional) |
| Pages | Home, Works, Work detail (dynamic), About, 404 |
| Stack | Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 |
| Animation | GSAP 3 + ScrollTrigger + SplitText (free since 3.13), Lenis smooth scroll |
| Page transitions | Custom GSAP overlay transition via `TransitionProvider` |
| Content | Typed local data in `/content` |
| Deploy | Vercel |

---

## 2. Demo Content (fictional)

### site.ts
```ts
export const site = {
  name: "Mira Solenne",
  heroLine1: "Brand & Web",
  heroLine2: "Designer",
  heroSub: "crafting identities and websites that move",
  email: "hello@mirasolenne.design",          // fake, demo only
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Dribbble",  href: "https://dribbble.com/" },
    { label: "LinkedIn",  href: "https://linkedin.com/" },
  ],
  statement: { eyebrow: "Strategy meets craft",
               line1: "Every pixel on [purpose].",           // [] = accent word
               line2: "Nothing generic, nothing rushed." },
  reelCaption: "Thoughtful [brand systems] – shipped as [living websites].",
  aboutHero: { line1: "Designing brands", line2: "that feel alive", since: "since 2018" },
};
```

### projects.ts (6 projects)
| slug | title | tags | year | placeholder hue |
|---|---|---|---|---|
| `tidewater-coffee` | Tidewater Coffee | Branding · Web design | 2026 | warm amber |
| `northbound` | Northbound | Web design · Motion | 2026 | slate green |
| `luma-skin` | Luma Skin | Branding · Packaging | 2025 | blush |
| `orbit` | Orbit | Product · Web app | 2025 | electric blue |
| `field-notes` | Field Notes Festival | Identity · Website | 2025 | acid yellow |
| `atelier-vale` | Atelier Vale | E-commerce | 2024 | walnut |

Each: `slug, title, tags[], year, summary, challenge, approach, outcome, metrics[], cover, gallery[], aspect ("portrait" | "landscape" | "square")`.

### about.ts
- Intro: "8+ years working with brands, crafting digital products and interactive experiences." with a short side paragraph containing two accent words.
- Services (3 columns): `01 Design`, `02 Development`, `✦ Full package`, each with a two-line description.
- Approach: one statement with accent words.
- Values (4 rows): "Content leads the design.", "Good design is a system of [decisions] rooted in [logic] and [empathy].", "Ship, then refine.", "Long walks fix most problems."

### Images (generate locally, no hotlinking)
- `scripts/gen-placeholders.mjs` (sharp): mockup-style placeholders (device frame on a soft gradient, or card on textured background) per project at 4:5, 3:4, 16:10 and 1:1.
- Hero portrait: **transparent PNG cutout** of an abstract figure/bust silhouette (SVG → PNG) so text can sit behind it.
- Round avatar for the footer.
- Reel: 10–12s MP4 from the placeholders (ffmpeg crossfade), plus poster frame.

---

## 3. Design System (original)

**Color**
```
--bg:        #EDEBE6   (light stone)
--fg:        #151515
--muted:     #9A978F
--dark:      #1E1B3A   (deep indigo, used for dark sections & footer)
--accent:    #FF7A45   (coral, for accent words on dark sections)
--accent-2:  #4B3FD1   (indigo-violet, for accent words on light sections)
--pill:      #FFFFFF
--line:      rgba(0,0,0,.12)  /  rgba(255,255,255,.15) on dark
```

**Type**: Display **"Inter Tight"** 400–500 with tight tracking (-0.045em) and line-height 0.95, sentence case (not uppercase). Body: same family at 400. Hero `clamp(3.5rem, 9vw, 9.5rem)`; section statements `clamp(1.6rem, 2.6vw, 2.6rem)`; footer headline `clamp(4rem, 9vw, 9rem)`.

**Accent words**: words wrapped in `[ ]` in content render in `--accent` on dark backgrounds and `--accent-2` on light.

**Shapes**: section panels have `border-radius: 28px` on the edge that slides over or reveals another section. Images have a 6px radius. Buttons are pills.

---

## 4. Global UI Chrome (fixed elements, all pages)

| Element | Position | Behavior |
|---|---|---|
| **Pill nav** | fixed, bottom-center, 24px from bottom | White pill with Home / Works / About. The active item has a filled accent pill behind it that **slides** between items (FLIP on route change). Uppercase 11px labels. |
| **Name / logo** | fixed top-left (hidden on Home hero) | "Mira Solenne", small text. |
| **Contact pill** | fixed top-right | Accent pill with a circular arrow icon. On Home it hides (y -100%) after scrolling past the hero; on other pages it stays. |
| **Side tabs** | fixed right edge, vertically centered | Two vertical tabs with rotated text: "Quick info" (white) opens the info drawer; "Availability" (dark) shows a small popover. |
| **Scroll progress** | right edge, 2px wide | Accent line that grows with scroll progress. |
| **Scroll-down button** | bottom-left on Home hero only | Small circle with ↓, scrolls one viewport. Fades out on scroll. |
| **Socials** | bottom-right on hero and footer | Three small square icons. |
| **Cursor label** | follows pointer over project cards | Small accent pill "View" offset to the bottom-right of the pointer (not a replacement cursor; the system cursor stays). |

Colors of chrome elements switch automatically on dark sections (use `mix-blend-mode` or a ScrollTrigger that toggles a `data-theme` on `<html>`).

---

## 5. Pages, Sections and Exact Motion

Timings below are scroll distances (vh) unless marked as seconds.

### 5.1 Footer: curtain reveal (every page)
- Footer is `position: fixed; bottom: 0; z-index: 0`, full viewport height, dark background.
- `<main>` sits above it (`z-index: 1`, bg `--bg`), with `margin-bottom: 100vh` and **rounded bottom corners (28px)**. Scrolling past the end slides the page up and away, revealing the stationary footer underneath.
- Content: "Let's work" (white) / "together" (accent) on two tight lines, with a **round avatar (~90px) overlapping the gap between the two lines**, centered. Below: "Drop me an email:" label, the email in white plus a small accent square **copy button** (copies, shows a "Copied" tooltip for 1.5s). ©2026 at bottom-left, socials at bottom-right.
- Motion: as the footer is revealed, headline lines move y 60px → 0 and the avatar scales 0.8 → 1 (scrubbed over the last 100vh).

### 5.2 Home

**1. Hero (sticky, stacked under the next section)**
- 100vh, `position: sticky; top: 0`.
- Two-line headline, left-aligned block centered on the page: line 1 "Brand & Web"; line 2 "Designer" **indented to the right** (about 25% of the block width).
- **Portrait cutout** positioned left of center and spanning both lines. Layering: line 1 sits *behind* the portrait's head (portrait overlaps the letters); line 2 sits beside it.
- Small sub-line under line 2, right-aligned with it.
- Load animation (seconds): lines mask-reveal from below (yPercent 100 → 0, 1.0s, `expo.out`, stagger 0.12); portrait fades in and rises y 40 → 0 (1.2s); sub-line, nav and chrome fade in at 0.6s.
- **Scroll: the hero does not move.** The next section slides up over it.

**2. Statement + Reel (dark panel that covers the hero)**
- Dark (`--dark`) panel with 28px **rounded top corners**; `position: relative; z-index: 2`; it scrolls up over the sticky hero (takes ~100vh to fully cover).
- Centered small eyebrow (one accent word), then two centered lines (`--fg-inverse`, accent word in `--accent`). Lines mask-reveal when 70% into view.
- **Play Reel pill**, directly below:
  - A black capsule (`border-radius: 999px`, about 36vw × 13vw) with huge "PLAY REEL" text spanning it.
  - **Behind the text, inside the capsule, a stack of 5 project thumbnails** at random small rotations (±6°), cycling every 0.35s (top card fades and drops out, the next shows): a flip-book effect.
  - The text color **alternates accent ↔ white** on each card swap.
  - Scroll-linked: the capsule scales 0.85 → 1.15 and moves up slightly as it crosses the viewport (scrub).
  - Hover: the thumbnail stack is replaced by the muted looping reel video playing inside the capsule. Click opens a full-screen video modal (capsule → full-screen FLIP expansion, 0.8s).
- Caption under the pill: two centered lines with accent words.

**3. Background color shift**
- As the caption scrolls toward the top, the **page background tweens from `--dark` to `--bg`** (scrubbed over ~40vh), and text color and accent color tween together (white → `--fg`, `--accent` → `--accent-2`). Implement by animating CSS variables on a wrapper, not by swapping sections.

**4. Recent works (pinned horizontal gallery)**
- Heading "Recent works" (medium size) rises from the bottom of the viewport and **pins at vertical center**.
- While pinned (~250vh of scroll), a **horizontal track of 8–10 cards** enters from the right edge and travels right → left **in front of the heading** (cards have a higher z-index, so the heading is occluded as they pass).
- Cards: fixed height ~38vh, varying widths by aspect ratio, 16px gaps; mixed styles (full-bleed photo, device on a pale card, framed card with a white border).
- Track motion: `x: 0 → -(trackWidth - 40vw)`, `ease: none`, scrub 1. Each card also has inner image parallax (xPercent -6 → 6).
- At the end of the pin, the whole block scrolls up normally and the curtain footer reveal begins.

### 5.3 Works

**1. Title**
- "Selected works" very large, centered, with a small superscript count "(06)" after it.
- Enter animation after the page transition: SplitText lines mask-reveal (0.9s, `expo.out`); the count fades in 0.3s later.

**2. Scattered project stream over a sticky title**
- The title becomes `position: sticky; top: 40vh` and, as soon as scrolling starts, **fades to ~45% opacity** (scrub over 30vh).
- Projects are laid out in a **scattered column**: alternating positions left / right / center-left / right-edge / left, each ~22–26vw wide, separated vertically by about 55vh.
- Each card scrolls **faster than the page** (parallax speed 1.15–1.35, varied per card), so cards overtake the title, passing over it.
- Card: image with 6px radius, then a row with the title on the left and tags on the right (small text).
- Hover: image scales 1.04 (0.6s), the "View" pill label follows the pointer.
- Click: image-to-hero FLIP into the project detail page (see 5.6).

### 5.4 Work detail `/works/[slug]`
- Hero: the title mask-reveals; the cover image (continued from the FLIP) settles full-width with 28px radius.
- Meta row: Client / Year / Services / Role, fading up with stagger 0.08.
- Body: Challenge / Approach / Outcome rows with the same label + rule pattern as the About "Approach" section; metrics count up.
- Gallery: alternating full-width and two-up images, each with a clip reveal (`inset(15% 0 15% 0 round 6px)` → `inset(0 round 6px)`, scrub) and inner parallax.
- Next project: large title link above the footer.

### 5.5 About

**1. Hero**
- Two centered lines "Designing brands / that feel alive" and below a small accent "since 2018". Mask reveal on enter.
- At the bottom of the viewport, a **row of 8 cards with varied heights**, bottom-aligned and partially cropped by the viewport bottom, enters as the page loads (stagger rise y 80 → 0).
- Scroll: the row **slides right → left** (`x: 0 → -40vw`, scrub) **while also moving up** with the page, so it travels diagonally. The headline moves up at normal speed and fades.

**2. Intro**
- Left: large two-line statement (`clamp(1.6rem, 2.6vw, 2.6rem)`). Right column: a small paragraph with two accent words, offset lower.
- **Portrait photo** (~16vw square, grayscale) below the statement on the left, with parallax speed 1.4 so it rises faster than the text.

**3. Services (dark panel)**
- Dark panel with **rounded top corners** that slides up into view, with a centered heading "I can help you with".
- Three columns: number (01 / 02 / ✦) in tiny text, a thin rule, title, and a 2–3 line description.
- The rules draw from left to right (scaleX 0 → 1, origin left, 0.8s, stagger 0.1), then the titles and text fade up.
- The panel's **bottom edge is also rounded**, and the light section after it slides over it (the same stacking trick as the Home hero, reversed in color).

**4. Approach**
- Small label "Approach", a full-width rule under it, then a large three-line statement with accent words. The lines reveal with a mask as they enter.

**5. Values**
- Label "Values" plus a rule, then 4 rows separated by rules. Each row is a statement with accent words; rules draw in and text fades up as each row enters (individual triggers, not one timeline).

**6. Footer curtain reveal.**

### 5.6 Page transitions (measured from the reference)
Sequence on clicking a nav link (total ~1.3s):
1. **0.00s** The nav's accent pill slides to the clicked item (0.4s, `power3.inOut`).
2. **0.15s** The current page (including the footer if visible) moves **up** `y: 0 → -25vh` and dims slightly (opacity 1 → 0.6), 0.7s, `power3.inOut`.
3. **0.15s** At the same time, a `--bg` panel with **28px rounded top corners** slides up from the bottom (`yPercent 100 → 0`), 0.7s, `power3.inOut`, carrying the new page's top chrome (name top-left, Contact pill top-right).
4. **0.85s** Route swaps under the panel; scroll resets to 0; ScrollTriggers are rebuilt.
5. **0.90s** The new page's headline mask-reveals (0.9s, `expo.out`) and its first media enters from the bottom (y 60 → 0, 1.0s).

Browser back/forward runs the same transition. Project-card clicks use the FLIP variant: the clicked image expands to the detail hero position while the rest of the page fades.

### 5.7 404
Large "404" whose characters drift away from the pointer (`quickTo`), with a "Back home" pill.

---

## 6. Motion Implementation Specs

| Effect | Implementation |
|---|---|
| Smooth scroll | Lenis (`lerp 0.09`, `smoothWheel: true`), `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `gsap.ticker.lagSmoothing(0)` |
| Sticky stacking | CSS `position: sticky` for the covered section and `z-index` plus a rounded top for the covering panel. **No GSAP pin needed.** Optionally scale the covered section 1 → 0.96 with a scrub. |
| Pinned horizontal gallery | `ScrollTrigger` with `pin: true`, `scrub: 1`, `end: () => "+=" + (track.scrollWidth - innerWidth*0.6)`, `invalidateOnRefresh: true`, `anticipatePin: 1` |
| Background color shift | One timeline that tweens CSS variables (`--page-bg`, `--page-fg`, `--page-accent`) on a wrapper, `scrub: true` |
| Parallax speed | A `data-speed` attribute; for each element `gsap.to(el, { y: () => (1 - speed) * ScrollTrigger.maxScroll(window) * 0.25, ease: 'none', scrollTrigger: { scrub: true }})`. Alternatively compute per element from its trigger range. |
| Mask text reveal | SplitText `type: 'lines', mask: 'lines'`, `yPercent: 100 → 0`, 0.9s `expo.out`, stagger 0.1, trigger `top 80%` |
| Rule draw | `scaleX 0 → 1`, `transform-origin: left`, 0.8s `power3.out` |
| Reel flip-book | `setInterval`-free: a GSAP repeat timeline (`repeat: -1`) swapping card z-order every 0.35s; paused when off-screen (`ScrollTrigger` `onToggle`) |
| Curtain footer | Pure CSS (fixed footer + `main` margin-bottom), plus a scrubbed tween for the footer content |
| Nav active pill | Absolutely positioned pill; `Flip.fit` or measured `x`/`width` tween on route change |
| View label | `gsap.quickTo` x/y, 0.25s; scale 0 → 1 on card enter |
| Theme toggling of chrome | ScrollTrigger per dark section that sets `document.documentElement.dataset.chrome = 'dark' | 'light'` on enter/leave in both directions |

---

## 7. Known Risks & Required Safeguards

1. **Lenis + ScrollTrigger desync** (effects lag or fire late): use the exact sync code in Section 6, initialize Lenis once in the root layout, and never run native `scroll-behavior: smooth` alongside it.
2. **Pins break after images or fonts load**: set explicit width and height (or aspect-ratio) on every image, await `document.fonts.ready` before creating triggers, and call `ScrollTrigger.refresh()` after the route's images load.
3. **Stale triggers after navigation** (pinned sections jump, wrong theme): every component uses `gsap.context()` / `useGSAP` with cleanup; the transition provider calls `ScrollTrigger.getAll().forEach(t => t.kill())` before the route swap, then `lenis.scrollTo(0, { immediate: true })` and `ScrollTrigger.refresh()` after the new page mounts.
4. **Sticky stacking fails**: no ancestor of a sticky element may have `overflow: hidden/auto`. Use `overflow: clip` where clipping is needed.
5. **Curtain footer gap or overlap**: compute the footer height in JS on resize and set `main { margin-bottom: footerHeight }`; `main` needs a solid background.
6. **iOS Safari address bar shifts pinned sections**: use `ScrollTrigger.config({ ignoreMobileResize: true })` and `svh`/`dvh` units for pinned heights; disable Lenis on touch (`syncTouch: false`).
7. **Mobile layout** (<768px): the horizontal gallery becomes a native swipe carousel (no pin); the Works scattered stream becomes a single column with mild parallax (speed ≤ 1.1); the hero portrait sits under the headline; the side tabs collapse into the Quick info drawer.
8. **Performance**: animate only transforms, opacity and clip-path; `will-change` only while animating; the reel flip-book pauses off-screen; lazy-load everything below the first viewport.
9. **Reduced motion**: disable Lenis, pins, scrubs and parallax; keep simple fades; the gallery becomes a static scroll-snap row.

---

## 8. File Structure

```
app/  layout.tsx, page.tsx, works/page.tsx, works/[slug]/page.tsx, about/page.tsx, not-found.tsx
components/
  chrome/  PillNav.tsx, TopBar.tsx, SideTabs.tsx, ScrollProgress.tsx, ViewLabel.tsx, QuickInfoDrawer.tsx
  layout/  CurtainFooter.tsx, PageShell.tsx
  motion/  SmoothScroll.tsx, TransitionProvider.tsx, TransitionLink.tsx, MaskText.tsx,
           Parallax.tsx, RuleDraw.tsx, ThemeSection.tsx, BgShift.tsx
  sections/home/   Hero.tsx, StatementReel.tsx, ReelPill.tsx, RecentWorksGallery.tsx
  sections/works/  WorksTitle.tsx, ScatterStream.tsx, ProjectCard.tsx
  sections/about/  AboutHero.tsx, DriftingRow.tsx, Intro.tsx, Services.tsx, Approach.tsx, Values.tsx
  sections/project/ ProjectHero.tsx, ProjectBody.tsx, ProjectGallery.tsx, NextProject.tsx
content/  site.ts, projects.ts, about.ts
lib/      gsap.ts, accent.tsx (parses [accent] words), useLenis.ts
scripts/  gen-placeholders.mjs, gen-reel.sh
```

---

## 9. Build Phases (with acceptance checks)

1. **Setup**: scaffold, tokens, fonts, `lib/gsap.ts`, Lenis sync. ✅ Smooth scroll works on a long test page.
2. **Content & assets**: content files, placeholders, cutout portrait, reel. ✅ All assets in `/public`.
3. **Chrome & footer**: pill nav, top bar, side tabs, progress bar, curtain footer. ✅ The footer reveals like a curtain on every route, and the chrome flips color over dark sections.
4. **Static pages**: every section, no JS motion, responsive at 360 / 768 / 1280 / 1920. ✅ No horizontal page scroll; sticky stacking already works with CSS alone.
5. **Home motion**: hero load, covering panel, reel pill, background shift, pinned gallery. ✅ Compare against Section 5.2 step by step.
6. **Works + About motion**: scattered stream, drifting row, services panel, values. ✅ Compare against 5.3 and 5.5.
7. **Page transitions**: 5.6 sequence plus the FLIP to detail. ✅ Navigate Home → Works → About → Home → back ×3 with no broken pins or wrong theme.
8. **Hardening**: work through every item in Section 7, then run Lighthouse (≥90 performance, 100 accessibility) and `npm run build` clean.
9. **Final check**: record a screen capture of the build scrolling through each page and compare it side by side with the reference recording, listing any timing differences and fixing them.

---

## 10. Start Prompt for Claude Code

> Read `PORTFOLIO_BUILD_PLAN.md` and build the project phase by phase. After each phase, run the dev server, check that phase's acceptance criteria in a browser (use Playwright screenshots at several scroll positions to verify motion states), and summarize before continuing. Treat Section 5's motion descriptions and Section 7's safeguards as requirements. Use only the fictional content and original design tokens in the plan; do not pull assets or code from any existing website.