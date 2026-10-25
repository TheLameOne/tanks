# PROJECT BRIEF: Tank's website

React + Vite · scroll-driven 3D (Three.js) · **Locomotive Scroll v5** · gallery-white design system

> Paste this whole file into Claude Code, Cursor or any coding agent. Attach: the `.glb`, the logo file(s), the two reference images, and `DESIGN.md`.

---

## 0. How to work

You are a senior creative front-end engineer (React, Three.js, scroll-driven motion). Build in the phases in §14. After every phase the project must run (`npm run dev`), build (`npm run build`) and pass `npm run check:design` (§15).

- **Phase 0 first.** Inspect the GLB and report your findings before building the scene.
- **Do not invent** specs, claims, certifications or contact details. Use only the content in §12. Anything missing becomes a visible `TODO(client)` placeholder.
- **Precedence when sources disagree:** (1) `DESIGN.md`, except for the documented deviations in §3.2; (2) this brief; (3) assumptions marked **PROPOSED** (they are my inventions to fill gaps, so keep them isolated in tokens where they are easy to change).
- Save the supplied design file as `/DESIGN.md` in the repo root and read it fully before touching any UI.
- Never hardcode colours, fonts, radii, shadows, easings or durations in components. Tokens only.
- Log every non-obvious decision and every deviation in `DECISIONS.md`.
- **Locomotive Scroll v5 is a ground-up rewrite of v4.** Do not use v4 snippets or tutorials from memory. Source of truth: https://scroll.locomotive.ca/docs. Where this brief and the installed package's TypeScript typings disagree, the typings win. Log the difference in `DECISIONS.md`.

---

## 1. Context

- **Company:** Tank's. It manufactures automatic vehicle-washing machines ("machines for machines").
- **Product 1:** **Tank's tiny**, a contactless, automatic, single-arm 360° high-pressure water and foam car-wash gantry. **Product 2** is coming soon.
- **Audience (assumed, confirm):** car-wash and service-station owners, dealerships, housing societies and fleet operators. Primary conversion is an enquiry or demo request.
- **Tone:** confident, precise, engineering-led, but warm. The brand idea is "ease of life": a clean vehicle is your second home.
- **Assets:** one `.glb` converted from STEP (all parts, assembled coordinates), logo file(s), two reference images (an annotated render and a side-view dimension drawing).
  - Do not reuse those screenshots directly. The drawing has a stray PowerPoint icon overlay. Recreate the dimension drawing as clean SVG and rebuild the callouts as live UI.

---

## 2. Tech stack

| Concern             | Choice                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App                 | React 18+, Vite, TypeScript                                                                                                                             |
| 3D                  | `three`, `@react-three/fiber`, `@react-three/drei`. Optional `@react-three/postprocessing`, desktop only                                                |
| **Scroll engine**   | **`locomotive-scroll` v5 (latest 5.x; 5.0.1 was the latest release I could verify).** It is built on Lenis, which arrives as its dependency.            |
| Motion (non-scroll) | `gsap` + `@gsap/react` (`useGSAP`) for the hero intro, text reveals, count-ups, loader. **No ScrollTrigger by default** (§5.10).                        |
| State               | `zustand`, only for coarse UI state (loaded, activeFeature, isMobile, menuOpen). Never per-frame values.                                                |
| Asset tooling (dev) | `@gltf-transform/cli`, `gltfjsx`                                                                                                                        |
| Dev-only            | `leva`, plus a debug overlay showing scroll, active segment and per-section progress                                                                    |
| Styling             | Tailwind v4 with `@theme` bound to the CSS variables in §3.3 (no arbitrary hex/px values in class names). CSS Modules is acceptable. Record the choice. |
| Icons               | `lucide-react`, stroke 1.5, `currentColor`, ink or muted only                                                                                           |
| Fonts               | `@fontsource-variable/inter`, self-hosted                                                                                                               |
| Prerender           | Evaluate `vite-react-ssg` (or equivalent) and record the decision (§10)                                                                                 |

**Banned dependencies:** `lenis`, `lenis/react`, `@studio-freight/react-lenis`, `locomotive-scroll@4`, any `react-locomotive-scroll` wrapper (v4-based). There must be exactly **one** scroll engine. Access Lenis only through the Locomotive instance (`locomotiveScroll.lenisInstance`).

Self-host all fonts, Draco decoders and lighting assets. No runtime CDN dependence.

---

## 3. Design system (from `DESIGN.md`)

### 3.1 Intent

Gallery-white monochrome. Near-black ink on pure white. Structure comes from a ladder of neutral tints and 1px hairlines, never shadows. Every interactive element is a stadium pill, containers are 24px, inputs and tiles 16px, and icon tiles are 30% squircles. **The machine is our "screenshot":** its charcoal frame, white cover and blue pump are the only saturated or dimensional things on the page, and the UI chrome frames it like a gallery wall. One electric-blue accent exists and it signals commercial decisions only. Never use it for CTAs or decoration.

### 3.2 Deviations from `DESIGN.md` (deliberate, resolved; log each in `DECISIONS.md`)

| Topic                            | Resolution                                                                                                                                                                                                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Nav                              | **Persistent floating pill** (system rule), with no hide-on-scroll. On mobile it shows logomark + CTA + menu button, and the menu opens as a 24px `canvas-soft` panel dropping below the pill. No full-screen takeover.                                                                                            |
| Hero heading style               | **No italics anywhere in the UI.** H1 is upright, weight 652. Italic exists only inside the logo asset.                                                                                                                                                                                                            |
| Hero heading size                | The system's `display` caps at 80px, so add a documented **`display-xl` extension** (hero only): same family and weight, `letter-spacing: 0`, size `clamp(3.25rem, 15vw, 16rem)`, line-height 0.9. On portrait viewports stack it as two lines ("Tank's" / "tiny."). Pair it with a `body-lg` weight-300 subtitle. |
| Shadows                          | **UI chrome has zero shadows.** Only exception: the active segmented-control pill (`--shadow-segment-active`). 3D contact or cast shadows inside the canvas are scene lighting, not chrome. They are allowed but must be soft and fade to nothing into the white page.                                             |
| Accent in 3D                     | **The accent never appears in the scene.** Snap flash = brief brightness lift on the part's own material. Focus highlight = keep the focused part's true colours and **lerp everything else toward `--color-canvas-soft`** (colour lerp, not alpha). Hotspot dots are ink.                                         |
| Dark mode                        | **Light only.** `color-scheme: light`. Ignore the dark-mode wording in the `ex-*` examples.                                                                                                                                                                                                                        |
| Typeface                         | Saans is commercial. Use **Inter Variable** (supports 652, 456 and 300 on the weight axis). Line-heights are reduced by 0.05 vs. spec per the substitution note. Set `font-synthesis: none`. If a Saans licence appears later, swap `--font-sans` and revert the line-heights.                                     |
| `badge-overlay`                  | Translucent grey with white text fails contrast on a white canvas (~2:1). **Do not use it over the 3D stage.** Hotspot labels use a `canvas-soft` pill + ink text; the numbered dot is an ink circle + white numeral.                                                                                              |
| `text-muted` #707070             | ≈4.9:1 on white (OK) but ≈4.3–4.5:1 on `canvas-soft` / `field` (just fails AA). Add **PROPOSED `--color-text-muted-strong: #666666`** for muted text on any tinted surface.                                                                                                                                        |
| `text-faint` #adadad             | ≈2.2:1 on white. **Only on `--color-ink` surfaces (footer).** Placeholders use `text-muted-strong`, and every field also has a visible label.                                                                                                                                                                      |
| `ex-auth-form-card`              | `field` (#f0f0f0) on `canvas-soft` (#f3f3f3) is invisible. The **contact form card is `canvas` + 1px `hairline-soft` outline (Level 2)**, with `field` inputs inside.                                                                                                                                              |
| `ex-data-table-cell` "mono-caps" | Contradicts "no all-caps". Table headers are `caption`/`label` weight 600, sentence case.                                                                                                                                                                                                                          |
| Breakpoints                      | The spec lists 719/840 as well as 640/768. Normalise to **600 / 640 / 768 / 1024 / 1280 / 1536**.                                                                                                                                                                                                                  |
| Logo colour                      | The brand brown isn't in the system. Render the logo **monochrome**: ink on light, white in the footer. Request single-colour SVGs from the client.                                                                                                                                                                |

### 3.3 Tokens: `src/design/tokens.css` (source of truth)

```css
/* Values from DESIGN.md unless marked PROPOSED. Components may only reference these. */
:root {
  color-scheme: light;

  /* Colour */
  --color-primary: #141414;
  --color-on-primary: #ffffff;
  --color-ink: #141414;
  --color-ink-soft: #262626;
  --color-text-muted: #707070;
  --color-text-muted-strong: #666666; /* PROPOSED: muted text on tinted surfaces */
  --color-text-faint: #adadad; /* only on --color-ink surfaces */
  --color-canvas: #ffffff;
  --color-canvas-soft: #f3f3f3;
  --color-field: #f0f0f0;
  --color-hairline-soft: #f0f0f0;
  --color-hairline: #e0e0e0;
  --color-accent: #0066ff; /* commercial signals only, max 2 uses site-wide */
  --color-scrim: rgba(115, 115, 115, 0.56);

  /* Type */
  --font-sans:
    "Inter Variable", -apple-system, "Helvetica Neue", Arial, sans-serif;
  --w-display: 652;
  --w-body: 456;
  --w-light: 300;
  --w-strong: 600;

  --fs-display-xl: clamp(
    3.25rem,
    15vw,
    16rem
  ); /* PROPOSED extension, hero only */
  --fs-display: clamp(2.75rem, 9vw, 5rem); /* 80 */
  --fs-h1: clamp(2.25rem, 6vw, 3.5rem); /* 56 */
  --fs-h2: clamp(1.875rem, 4.6vw, 2.75rem); /* 44 */
  --fs-h3: clamp(1.5rem, 3.4vw, 2rem); /* 32 */
  --fs-h4: clamp(1.25rem, 2.4vw, 1.5rem); /* 24 */
  --fs-title: 1.25rem;
  --fs-body-lg: 1.25rem;
  --fs-body: 1rem;
  --fs-body-sm: 0.875rem;
  --fs-link: 1rem;
  --fs-label: 0.75rem;
  --fs-caption: 0.75rem;

  /* Inter-adjusted: Saans value minus 0.05 (display-xl is PROPOSED) */
  --lh-display-xl: 0.9;
  --lh-display: 0.95;
  --lh-h1: 0.95;
  --lh-h2: 1.08;
  --lh-h3: 1.08;
  --lh-h4: 1.2;
  --lh-title: 1.25;
  --lh-body-lg: 1.33;
  --lh-body: 1.33;
  --lh-body-sm: 1.38;
  --lh-label: 1.28;
  --lh-caption: 1.28;

  /* Shape */
  --radius-none: 0;
  --radius-sm: 16px;
  --radius-md: 24px;
  --radius-full: 9999px;
  --radius-squircle: 30%;

  /* Spacing (8px base) */
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
  --space-section: 80px;
  --space-section-lg: 120px;

  /* Sizing: PROPOSED (spec says only "fixed-height pill") */
  --control-h: 44px;
  --control-h-lg: 52px;
  --nav-h: 56px;
  --container-max: 1280px; /* gutters: 16px <768, 24px ≥768, 32px ≥1024 */

  /* Pinned scroll lengths: PROPOSED. Scroll distance AFTER the 100svh stage. */
  --pin-assembly: 300svh;
  --pin-features: 420svh;

  /* Elevation: the single documented exception; value PROPOSED */
  --shadow-segment-active: 0 1px 2px rgb(20 20 20 / 0.12);

  /* Motion: PROPOSED. Calm and precise; no bounce/overshoot in UI. */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 160ms;
  --dur-base: 320ms;
  --dur-slow: 640ms;
  --dur-hero: 1100ms;
  --stagger-chars: 28ms;
  --stagger-lines: 90ms;

  /* Layers: hero H1 sits BELOW the canvas so parts overlap the letters */
  --z-hero-title: 1;
  --z-canvas: 2;
  --z-content: 3;
  --z-hotspot: 4;
  --z-nav: 10;
  --z-sheet: 20;
  --z-toast: 30;
}

@media (max-width: 767px) {
  :root {
    --pin-assembly: 220svh;
    --pin-features: 340svh;
  }
}

/* Role classes: components use these, never raw font values */
.t-display-xl {
  font: var(--w-display) var(--fs-display-xl)/var(--lh-display-xl)
    var(--font-sans);
  letter-spacing: 0;
}
.t-display {
  font: var(--w-display) var(--fs-display)/var(--lh-display) var(--font-sans);
  letter-spacing: 0;
}
.t-h1 {
  font: var(--w-display) var(--fs-h1)/var(--lh-h1) var(--font-sans);
  letter-spacing: 0;
}
.t-h2 {
  font: var(--w-display) var(--fs-h2)/var(--lh-h2) var(--font-sans);
  letter-spacing: 0;
}
.t-h3 {
  font: var(--w-display) var(--fs-h3)/var(--lh-h3) var(--font-sans);
  letter-spacing: 0;
}
.t-h4 {
  font: var(--w-display) var(--fs-h4)/var(--lh-h4) var(--font-sans);
  letter-spacing: 0;
}
.t-title {
  font: var(--w-strong) var(--fs-title)/var(--lh-title) var(--font-sans);
  letter-spacing: 0;
}
.t-body-lg {
  font: var(--w-light) var(--fs-body-lg)/var(--lh-body-lg) var(--font-sans);
  letter-spacing: 0;
}
.t-body {
  font: var(--w-body) var(--fs-body)/var(--lh-body) var(--font-sans);
  letter-spacing: 0;
}
.t-body-sm {
  font: var(--w-body) var(--fs-body-sm)/var(--lh-body-sm) var(--font-sans);
  letter-spacing: 0;
}
.t-link {
  font: var(--w-strong) var(--fs-link)/var(--lh-body) var(--font-sans);
  letter-spacing: 0;
}
.t-label {
  font: var(--w-strong) var(--fs-label)/var(--lh-label) var(--font-sans);
  letter-spacing: 0;
}
.t-caption {
  font: var(--w-body) var(--fs-caption)/var(--lh-caption) var(--font-sans);
  letter-spacing: 0;
}
```

### 3.4 `tokens.ts`

Exports the breakpoints (600/640/768/1024/1280/1536) and `token(name)`, which reads a CSS variable from `document.documentElement` (one source of truth, no duplicated values).

### 3.5 3D scene theming

- `src/scene/theme.ts` builds the scene palette from `token()` at mount: canvas, canvas-soft (dim target), ink, hairline. Use `new THREE.Color(token(...))` so colour management converts correctly.
- Canvas is **transparent** (`alpha: true`). The ground is a `ShadowMaterial` / `ContactShadows` layer, not a coloured plane, so there is no horizon seam against the white page. The RCC base is a real part with a light-grey concrete material.
- The white gantry cover must read against a white page: albedo ≤ ~0.85, key light from upper-left for form shading, soft AO/contact shadow, a subtle rim light. Tune exposure so nothing clips to pure white.
- Hero layout: keep scattered parts mostly in the lower ~55% of the viewport so the ink H1 stays legible where it's partly overlapped. The charcoal frame vs. ink text is the contrast risk, so check it in Phase 2.
- Hotspots: project anchor points to screen space in `useFrame` and write `transform` straight to DOM refs (no React state per frame). Visuals: 1px ink leader line ending in a small ink dot (echoing the reference render), a numbered ink circle (24px visible, ≥44px hit area), and a `canvas-soft` pill label with ink text (`t-label`). Mobile: dots only, and tapping opens a bottom sheet.

---

## 4. Experience concept

One long scroll page. A single fixed full-viewport `<Canvas>` sits **behind** the HTML sections (`pointer-events: none`), and a shared `sceneState` is driven by scroll. Sections are real DOM, so text stays crawlable and accessible. The machine is the protagonist that persists across sections while the camera and part states change.

### Storyboard

| #   | Section                        | Scroll behaviour                                                                            |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| 1   | **Hero**                       | Giant H1 "Tank's tiny." All machine parts lie scattered on the ground plane, gently idling. |
| 2   | **Assembly** (pinned, ~300svh) | Scrubbed: the parts lift, fly and snap into the finished machine.                           |
| 3   | **Meet Tank's tiny**           | Assembled machine at a hero 3/4 angle with a slow orbit. Key stats count up.                |
| 4   | **Why "tiny"**                 | Compact-gantry story, with an SVG dimension drawing that line-draws on scroll.              |
| 5   | **Salient features** (pinned)  | Camera tours the machine. Each feature focuses the relevant part and dims the rest.         |
| 6   | **Engineered to last**         | Feature cards.                                                                              |
| 7   | **Specs & components**         | Spec rows, "built with" make marquee, controls and facilities.                              |
| 8   | **About Tank's**               | Company story. The machine recedes.                                                         |
| 9   | **Coming soon**                | Teaser card for Product 2 with an email "notify me".                                        |
| 10  | **Contact**                    | Enquiry form, WhatsApp and call CTAs, footer.                                               |

---

## 5. Scroll architecture: Locomotive Scroll v5

### 5.1 Role

Locomotive Scroll v5 is the **only** scroll engine. It provides smooth wheel scrolling (via Lenis, with native scrolling kept on touch devices), in-view detection, simple parallax, CSS/JS progress hooks and anchor scrolling. Everything scroll-linked on the page is built from it plus two things it deliberately doesn't provide: **CSS `position: sticky` for pinning** and a small **`scrollBus`** that turns the scroll value into progress numbers for the 3D scene.

### 5.2 What v5 is and isn't

- **Removed in v5, never use:** `data-scroll-container`, `data-scroll-section`, `data-scroll-sticky`, `data-scroll-delay`, `data-scroll-direction`, `data-scroll-target`, the custom scrollbar, ModularJS hooks, and the v4 `el` / `smooth` constructor options.
- **Available and used here:**
  - Attributes: `data-scroll`, `data-scroll-position`, `data-scroll-offset`, `data-scroll-class` (default class `is-inview`), `data-scroll-repeat`, `data-scroll-speed`, `data-scroll-call`, `data-scroll-css-progress` (sets `--progress`, 0–1), `data-scroll-event-progress`, `data-scroll-to` (+ `-href`, `-offset`, `-duration`), `data-scroll-ignore-fold`, `data-scroll-enable-touch-speed`.
  - Constructor options: `lenisOptions`, `triggerRootMargin`, `rafRootMargin`, `autoStart`, `scrollCallback`, `initCustomTicker` / `destroyCustomTicker`.
  - Methods: `start()`, `stop()`, `resize()`, `scrollTo(target, options)`, `addScrollElements(container)`, `removeScrollElements(container)`, `destroy()`.
  - Instance: `locomotiveScroll.lenisInstance` (the Lenis instance, for velocity, direction, scroll).
- **Parallax (`data-scroll-speed`)** is relative to the scroll container size and is **automatically disabled on touch devices**. That's fine; we want native scrolling on phones.
- **Not SSR-safe.** It touches `window` and IntersectionObserver. Instantiate only inside an effect, never at module scope.
- CSS: `import 'locomotive-scroll/dist/locomotive-scroll.css'` once, at the app root.

### 5.3 Setup: `src/scroll/ScrollProvider.tsx`

One instance, created in an effect after the DOM is mounted, destroyed on unmount, StrictMode-safe (create → destroy → create must leave exactly one live instance). Share GSAP's ticker as the clock so there's a single RAF for scroll and tweens.

```tsx
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { gsap } from "gsap";
import { scrollBus } from "./scrollBus";

useEffect(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.ticker.lagSmoothing(0);

  let ls: LocomotiveScroll | null = null;
  try {
    ls = new LocomotiveScroll({
      // Use only options that exist in the installed typings. Touch stays native by default.
      lenisOptions: { smoothWheel: !reduced },
      scrollCallback: (e) => scrollBus.emit(e), // { scroll, limit, velocity, direction, progress }
      initCustomTicker: (render) => gsap.ticker.add(render),
      destroyCustomTicker: (render) => gsap.ticker.remove(render),
    });
  } catch (err) {
    document.documentElement.classList.remove("js"); // content must stay visible if the engine fails
    console.error(err);
  }
  scrollApi.set(ls); // exposes scrollTo/stop/start/resize/add/remove
  return () => {
    ls?.destroy();
    scrollApi.set(null);
  };
}, []);
```

The `initCustomTicker` / `destroyCustomTicker` pattern is the documented one. Verify smoothness in Phase 1.

### 5.4 `scrollBus` and `useSectionProgress`

- `scrollBus.ts`: tiny pub/sub holding the last `scrollCallback` payload. `subscribe(fn)` calls `fn(last)` immediately and returns an unsubscribe function. No React state.
- `useSectionProgress(trackRef, stageRef, onProgress)`:
  - Measures `top = rect.top + scrollY` and `span = track.offsetHeight − stage.offsetHeight` (use the stage element, not `innerHeight`, which changes with the iOS toolbar).
  - Re-measures on a `ResizeObserver` on the track and `document.body`, on `document.fonts.ready`, and on breakpoint changes.
  - On every bus event: `p = clamp((scroll − top) / span, 0, 1)` → `onProgress(p)`.
  - Use the Lenis `scroll` value from the payload, not `window.scrollY`, so DOM and 3D agree with the smoothing.
- `sceneDirector.ts`: owns an ordered list of segments `{ id, el, mode: 'pin' | 'pass' }`. For `pin`, local progress is the pinned progress above. For `pass`, it's `(scroll + viewportH − top) / (height + viewportH)`. It writes `sceneState` (`assemble`, `cameraBeat`, `focusPart`, `orbit`, `heroProgress`, `aboutFade`) and calls R3F `invalidate()`. The canvas only reads `sceneState`.

### 5.5 Pinned stages = CSS sticky

```html
<section class="pin-track" style="height: calc(100svh + var(--pin-assembly))">
  <div class="pin-stage" style="position: sticky; top: 0; height: 100svh">
    …
  </div>
</section>
```

- **Sticky breaks if any ancestor has `overflow: hidden|auto|scroll`.** No `overflow-x: hidden` on `html`, `body`, `#root`, `main` or any ancestor of a pin track. Use `overflow-x: clip` where you must, or fix the offending element. Add a dev-only `assertStickyAncestors()` that walks up from every `.pin-stage` and `console.warn`s on a violating ancestor.
- Masked text reveals (`overflow: hidden` on a line wrapper) are fine as long as they are not ancestors of a pin stage.
- Use `svh` for stage and track heights. Size the fixed canvas with `lvh` so the iOS toolbar showing and hiding never resizes the drawing buffer. Compute camera framing from the visible (`svh`) area.
- Never put `data-scroll-speed` on anything inside a pin stage (transform fights).

### 5.6 Which mechanism for what

| Need                                                       | Mechanism                                                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Smooth wheel scrolling                                     | Locomotive (Lenis inside). Touch devices stay native.                                                       |
| Reveal on enter                                            | `data-scroll` → `.is-inview` class → CSS transitions from motion tokens                                     |
| Decorative parallax                                        | `data-scroll-speed` ≈ 0.05–0.2, desktop only, never on the canvas or inside pin stages                      |
| DOM-only scroll-linked effects (hero drift, SVG line-draw) | `data-scroll-css-progress` → `--progress` in CSS                                                            |
| Trigger once on enter (count-ups)                          | `data-scroll-call="stats-in"` → listen for the window event `{ target, way, from }` → GSAP tween, fire once |
| Pinned stages and 3D scrub values                          | CSS sticky + `useSectionProgress` → `sceneState`                                                            |
| Anchor navigation                                          | `data-scroll-to` on links (or `scrollApi.scrollTo(el, { offset })`)                                         |
| Lock scrolling (menu, bottom sheet)                        | `scrollApi.stop()` / `start()`, and `data-lenis-prevent` on any scrollable sheet content                    |
| Clicking a feature row                                     | `scrollApi.scrollTo(top + (i / N) * span)`                                                                  |

Reveal CSS lives in one place and is guarded by a `.js` class set by an inline script in `index.html`, so nothing is hidden if JS or the engine fails:

```css
.js .reveal {
  opacity: 0;
  transform: translateY(var(--space-md));
}
.js .reveal.is-inview {
  opacity: 1;
  transform: none;
  transition:
    opacity var(--dur-slow) var(--ease-out),
    transform var(--dur-slow) var(--ease-out);
  transition-delay: calc(var(--i, 0) * var(--stagger-lines));
}
@media (prefers-reduced-motion: reduce) {
  .js .reveal {
    transform: none;
  }
  .js .reveal.is-inview {
    transition-duration: var(--dur-fast);
    transition-delay: 0s;
  }
}
```

### 5.7 Lifecycle gotchas (handle all)

- **Instantiate after mount.** Locomotive scans `[data-scroll]` elements at init. The root effect runs after children are committed, so anything rendered synchronously is picked up. For anything that mounts later (lazy sections, bottom sheet, accordion content), call `addScrollElements(container)` on mount and `removeScrollElements(container)` on unmount.
- **Layout changes.** Locomotive follows resize via Lenis's observers, but our own cached offsets in `useSectionProgress` don't. Re-measure on the observers above. Call `scrollApi.resize()` after fonts load and after any dynamic height change Lenis wouldn't notice.
- **Menu and sheet.** `stop()` when opened, `start()` when closed (also on route/unmount cleanup).
- **Hash links.** On load, if there's a hash, `scrollTo(el, { immediate: true })` after fonts and layout are stable. Otherwise set `history.scrollRestoration = 'manual'` and start at top, so a reload never lands mid-assembly.
- **SSR / prerender.** The engine is constructed only in an effect. Components must render complete, visible content without it.
- **No double engines.** `check:design` fails on imports of `lenis` (§15).

### 5.8 Touch and reduced motion

- **Touch:** native scroll, no smoothing, no parallax (v5 default). Pinned scrubbing still works because it reads the scroll value. Add light damping in `useFrame` so assembly doesn't step with scroll-event cadence (§5.9).
- **`prefers-reduced-motion`:** construct with `smoothWheel: false`; don't render `data-scroll-speed`; reveals become short fades; pin tracks collapse to `height: auto`; `sceneState.assemble = 1` (machine shown assembled, static); no marquee animation; no count-up (show final numbers).

### 5.9 Render-loop coupling

- R3F `frameloop="demand"`. `sceneDirector` calls `invalidate()` on every scroll event and on pointer move (hero only). Run continuously only during the hero idle and snap flashes.
- In `useFrame`, damp displayed values toward `sceneState` (`damp(current, target, λ, dt)`), with a higher λ on desktop (Lenis already smooths) than on touch. Keep invalidating until `|target − current| < ε`, then stop.
- Read `sceneState` from a mutable ref. No React re-renders per frame.

### 5.10 If ScrollTrigger is ever needed

Default is **no ScrollTrigger**. If a specific effect genuinely needs it, use it unpinned and sync once: `scrollApi.lenis.on('scroll', ScrollTrigger.update)`. Never use ScrollTrigger `pin`. Log it in `DECISIONS.md` first.

---

## 6. Sections

Whitespace separates sections (`--space-section` on mobile, `--space-section-lg` between major acts on desktop). **No divider rules, no coloured section bands.** Alternate dense moments (assembly, features) with near-empty typographic interludes (About).

### 6.1 Hero (not pinned)

- `display-xl` H1 "Tank's tiny." in the DOM immediately (LCP). It must not wait for the GLB. Sits **behind** the transparent canvas (`--z-hero-title` < `--z-canvas`) so scattered parts overlap the letters. A `transform` on the H1 wrapper creates a stacking context, so assign the z-index on that wrapper.
- Effect: masked character-by-character slide-up on load (GSAP timeline, `--stagger-chars`). Upright type only.
- Pointer parallax on the heading and camera (disabled on touch and reduced motion).
- Scroll: the wrapper carries `data-scroll data-scroll-css-progress`, and CSS maps `--progress` to the heading drifting up, scaling slightly and fading. In parallel, `sceneState.heroProgress` (from `scrollBus`) raises the camera and rotates toward the assembly view. Calibrate `data-scroll-position` / `data-scroll-offset` in the Phase 1 spike.
- Subtitle: `t-body-lg` light: "The world's smallest single-arm gantry car wash." (flagged claim, §13). Buttons: `Button primary` "Enquire now" + `Button outline` "See how it's built". A scroll cue.
- Loading: no blocking preloader. Show the heading plus a hairline progress bar. When the GLB is ready, the parts drop onto the ground with a short stagger.

### 6.2 Assembly (pinned, `--pin-assembly`)

- Sticky track. Scroll progress 0→1 drives `assemble`, fully reversible with no popping.
- Parts assemble in logical groups (final order set after Phase 0). Likely order:
  1. RCC base as ground slab
  2. gantry columns and frame
  3. top beams and gantry cover
  4. rails and wheels
  5. rotating arm
  6. foam shower mechanism
  7. pump and piping
  8. operating panel with touch screen
  9. under-chassis and wheel-wash assembly
  10. fasteners last ("tighten" beat)
- Text beats (editable): "Fewer parts." (0–⅓) → "Lighter build." (⅓–⅔) → "Manual erection, no crane." (⅔–1). Beat headline in `t-h2`, one `t-body-lg` line. Cross-fade stacked text blocks via a `data-beat` attribute set from `scrollBus` only when the beat changes (never per frame).
- A non-interactive progress track styled like `SegmentedControl` shows the assembly groups.
- Past p ≈ 0.85 the numbered hotspots for the 7 components in §12.5 fade in. On mobile, tapping one opens a bottom sheet.

### 6.3 Meet Tank's tiny (`pass`)

`Badge accent` "New" (**accent use #1 of 2**). Four stat tiles (`Card` featured): 3 min · 13 nozzles · 22 bar · 6.1 m. Numbers in `t-h1`, labels in `t-body-sm` `text-muted-strong`. Count-up once via `data-scroll-call`. Assembled machine at a 3/4 angle with a slow orbit.

### 6.4 Why "tiny" (`pass`)

Animated SVG dimension drawing: 1px ink strokes, `hairline` guides, `t-caption` dimension text, generic outline car silhouette (no real vehicle model or brand). Strokes use `pathLength="1"` with `stroke-dashoffset: calc(1 - var(--progress))` driven by `data-scroll-css-progress`. The camera settles on a side elevation to echo the drawing.

### 6.5 Salient features (pinned, `--pin-features`)

`AccordionRow` list with `IconTile` icons. Active index = `floor(p × N)` from the pinned progress. The active row expands and drives `focusPart`, moving the camera and dimming everything else (colour lerp to `canvas-soft`, not alpha). Clicking a row scrolls to that feature's progress. On mobile the active row docks at the bottom as a `Card` so the machine keeps the top ~60% of the viewport.

Suggested mapping, to be confirmed against real node names:

- car-length detection → sensors on the gantry
- under-chassis and wheel wash → base-level assembly
- 6.1 m longest car → dimension line with a car silhouette
- high pressure, less water → arm and nozzles
- 22 bar × 13 nozzles → arm close-up
- SS304 → highlight all wet-zone parts
- compact gantry, no open flexible pipes → gantry cover and frame

### 6.6 Engineered to last

`SegmentedControl` filter (All / Structure / Water / Maintenance; my grouping, flag for client) over a 3→2→1 column grid of resting `Card`s with `IconTile`s. Cards use `.reveal` with `--i` stagger.

### 6.7 Specs and components

Spec rows separated by 1px `canvas-soft` rules (label `text-muted-strong`, value `t-h4`). Full-bleed `BrandChip` marquee for supplier makes (CSS animation, pause on hover, static wrapped grid on reduced motion). Controls and facilities as `Chip`s.

### 6.8 About (`pass`)

Typographic interlude: large `t-h2`/`t-h3` statements, `t-body` muted paragraphs. `sceneState.aboutFade` fades the machine out (opacity only, no layout change).

### 6.9 Coming soon

Featured `Card`, `Badge accent` "Coming soon" (**accent use #2 of 2**), email `Field` + `Button primary` "Notify me".

### 6.10 Contact and footer

Form card = `canvas` + `hairline-soft` outline (§3.2). `Button outline` for WhatsApp, `Button soft` for call. Then the `Footer`.

### Nav

Persistent floating `NavPill`. Anchor links use `data-scroll-to` with an offset that clears the pill (verify sign and value in the spike).

---

## 7. 3D pipeline

**Phase 0: inspect and optimise the GLB.** A script outputs `glb-report.md` with the node tree, names, triangle counts per mesh, bounding boxes, materials, units and up-axis.

- STEP conversions often arrive in millimetres, Z-up, with generic names ("Part_123") and very high triangle counts.
- Normalise: scale to metres, Y-up, centre on the origin with the base on y=0. Remove any render-backdrop wall or floor that isn't part of the machine.
- Merge tiny duplicate fasteners (InstancedMesh or per-subassembly merge). Don't animate hundreds of individual bolts.
- Compress with `gltf-transform` (Draco or Meshopt, dedupe, prune, weld, simplify). Output **two variants**: `tiny.desktop.glb` and `tiny.mobile.glb` (target ≤ 4 MB for mobile, and well under 250k triangles).
- Generate a typed `parts.ts` map from node names to `{ id, group, label }`. Rename nodes where needed.

**Scatter positions.** A Node script computes a deterministic, seeded "lying on the ground" layout from bounding boxes: stable orientation (shortest axis vertical), yaw only, non-overlapping packing in an ellipse sized to the hero framing. Output `scatter.json`, hand-editable, with per-part manual overrides.

**Assembly choreography** lives in `assemblyConfig.ts`. Each part has `{ group, start, duration, lift, scatterPos, scatterYaw }`. Each frame, per part:

- `p = ease(clamp((assemble − start) / duration))`
- XZ lerp with a Y arc (`+ sin(πp) · lift`)
- quaternion slerp from scatter to home
- an optional brightness lift on snap (never the accent colour)

No physics.

**Materials** (STEP exports lose them): a small library in `materialMap.ts`, keyed by node-name patterns: powder-coated charcoal steel (frame), white gantry cover, brushed SS304 (wet-zone parts), black rubber, blue pump/motor, dark glass (touch screen), light-grey concrete (RCC base). The reference render shows a charcoal frame, white cover and blue pump.

**Lighting:** soft studio look, key light and soft shadow on desktop only. Local HDR or drei `Lightformers` (no CDN). Static or baked `ContactShadows`, ACES tone mapping, sRGB output.

**Camera:** keyframes in `cameraPath.ts`, `{ pos, target, fov }` per segment id (hero, assembly, meet, why-tiny, features, about), interpolated with eased segments and blended across gaps between segments. Frame responsively by aspect ratio: on portrait, pull back and adjust FOV so the whole machine fits.

---

## 8. Component inventory (build all in Phase 1, with every state)

| Component                           | Spec                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NavPill`                           | Floating, centred, `canvas-soft`, `radius-full`, height `--nav-h`, ~16px from top. Logo left, `t-link` links right, `Button primary` CTA. Persistent. Solid fill (no blur or gradient).                                                                                                                                                                                                            |
| `Button` (primary / outline / soft) | Height `--control-h`, `radius-full`, padding `0 var(--space-md)`, `t-link`. Primary: `primary` fill, `on-primary` text. Outline: `canvas` fill + 1px `hairline`. Soft: `canvas-soft`, no border. **PROPOSED states:** hover primary → `ink-soft`, outline/soft → `field`; press `scale(.98)`; focus = 2px `ink` ring, 2px offset (white ring on ink surfaces); disabled 40% opacity. Never accent. |
| `Badge`                             | Pill, `t-label`. The `accent` variant is the only blue element (§6.3, §6.9).                                                                                                                                                                                                                                                                                                                       |
| `SegmentedControl`                  | `canvas-soft` stadium track; active option is a `canvas` pill with `--shadow-segment-active`; inactive label `text-muted-strong`. Full-pill tap targets.                                                                                                                                                                                                                                           |
| `Card`                              | Resting: `canvas` + 1px `hairline-soft`, `radius-md`. Featured: `canvas-soft`, borderless. Padding `--space-lg`.                                                                                                                                                                                                                                                                                   |
| `AccordionRow`                      | FAQ-row chrome: full-width `canvas-soft`, `radius-sm`, `t-body` label, trailing chevron, `--space-sm` gaps.                                                                                                                                                                                                                                                                                        |
| `IconTile`                          | 30% squircle, `canvas-soft` fill, centred lucide icon (ink). Sizes 32/48/64.                                                                                                                                                                                                                                                                                                                       |
| `BrandChip`                         | `IconTile` (monogram letter) + name in `t-h3`. Text-only supplier wordmarks, no logos.                                                                                                                                                                                                                                                                                                             |
| `Field`                             | `field` fill, no border, `radius-sm`, padding `--space-sm --space-md`, **visible label above**, `text-muted-strong` placeholder, focus = 2px `ink` ring, error = ink text + icon + message (no red).                                                                                                                                                                                               |
| `Chip`                              | Static `canvas-soft` pill, `t-body-sm`, for the controls and facilities list.                                                                                                                                                                                                                                                                                                                      |
| `BottomSheet`                       | `canvas`, top corners `radius-md`, grabber = small `hairline` pill, focus-trapped, swipe-to-dismiss. Calls `stop()`/`start()`; scrollable content carries `data-lenis-prevent`; registers with `addScrollElements` if it contains `[data-scroll]`.                                                                                                                                                 |
| `Footer`                            | `ink` band, top corners `radius-md`, white wordmark at `t-display`, tagline "Machines for machines." in `text-faint`, two link columns (`text-faint` links, `on-primary` for emphasis rows).                                                                                                                                                                                                       |
| `Hotspot`                           | See §3.5.                                                                                                                                                                                                                                                                                                                                                                                          |
| `DimensionDrawing`                  | See §6.4.                                                                                                                                                                                                                                                                                                                                                                                          |
| `Counter`, `SplitText`              | Count-up fired once from a `data-scroll-call` event; per-character masked reveal.                                                                                                                                                                                                                                                                                                                  |

---

## 9. Mobile and responsive

- Mobile-first, breakpoints from tokens, no horizontal scroll from 320px to 1920px, tap targets ≥ 44px.
- Mobile 3D: load `tiny.mobile.glb`, cap DPR at 1.5, no post-processing, no real-time shadows (contact shadow only), reduced idle animation.
- Native touch scrolling, no parallax, damped scene values (§5.8, §5.9). Pinned track lengths come from the mobile token overrides.
- Pinned text docks at the bottom as a `Card` (`canvas`, `hairline-soft`, `radius-md`) so the machine keeps the top ~60% of the viewport. Hotspots become numbered dots with a bottom sheet.
- Nav collapses to logomark + CTA + menu button. The menu opens as a `canvas-soft` `radius-md` panel under the pill (focus-trapped, closes on outside tap or Esc, locks scroll).
- Hero H1 stacks to two lines on portrait. Verify "Tank's" never overflows at 320px.
- Test on a mid-range Android device and on iOS Safari (toolbar resize, momentum scroll, sticky pin behaviour).
- WebGL unavailable or very low-end device: show a pre-rendered poster of the assembled machine with simple CSS reveals, and keep all content.

---

## 10. Performance, accessibility, SEO

- Lazy-load the 3D chunk and the GLB. The first paint contains the heading, nav and CTA.
- All copy lives in semantic DOM (ordered headings, landmarks). The canvas is `aria-hidden`, with a text equivalent of the assembly story.
- Visible focus states (2px ink, white on ink), keyboard-operable nav, form and sheets. WCAG AA for every text/surface pair. Report failures instead of silently changing tokens.
- Marquees, count-ups, parallax and scrubbing respect `prefers-reduced-motion`.
- Meta, Open Graph and Twitter tags, plus `Product` + `Organization` JSON-LD. A Vite SPA is weak for crawlers, so evaluate `vite-react-ssg` (or equivalent prerendering) and record the decision. Locomotive must stay effect-only so prerendered HTML is complete and visible.
- Contact form: client-side validation, honeypot, and Formspree / Web3Forms / EmailJS or a serverless endpoint. Fields: name, phone, email, business type, city, message. Include success and error states.
- Contact methods: WhatsApp click-to-chat and click-to-call, with `TODO(client)` numbers.

---

## 11. Suggested structure

```
src/
  design/        tokens.css, tokens.ts
  scroll/        ScrollProvider.tsx, scrollApi.ts, scrollBus.ts,
                 useSectionProgress.ts, sceneDirector.ts, assertStickyAncestors.ts
  scene/         Scene.tsx, Machine.tsx, cameraPath.ts, assemblyConfig.ts,
                 materialMap.ts, scatter.json, parts.ts, sceneState.ts, theme.ts
  sections/      Hero, Assembly, Meet, WhyTiny, Features, Durability,
                 Specs, About, ComingSoon, Contact
  components/    NavPill, Button, Badge, SegmentedControl, Card, AccordionRow,
                 IconTile, BrandChip, Field, Chip, BottomSheet, Footer,
                 Counter, SplitText, Hotspot, DimensionDrawing
  hooks/         useIsMobile, useReducedMotion
  content/       content.ts   (all copy lives here)
  dev/           Styleguide.tsx, ScrollLab.tsx, DebugOverlay.tsx
scripts/         inspect-glb, optimize-glb, generate-scatter, check-design-rules.mjs
public/          models/, draco/, lighting/
DESIGN.md  DECISIONS.md  SCROLL-NOTES.md
```

---

## 12. Content (source of truth, lightly cleaned; keep in `content.ts`)

**12.1 About Tank's.** Tank's was founded on one idea, dedicated to people and driven by a desire to change the world through ease of life that is directly connected to us and everyone else. We manufacture machines "for machines", which are our second homes nowadays: vehicles. Vehicle numbers on our roads are growing rapidly because vehicles have become a necessity. But with temperature variations and dusty environments, our vehicles get finely sheltered by dust, airborne pollution, road particles, moisture, bird droppings and many other contaminants. Tank's applies a slight force to those intruders, in a decent mechanical way, to make our second homes super clean and attractive. We manufacture automatic vehicle-washing machines built with advanced technology to meet world-class standards.

**12.2 Who is Tank's tiny.** A contactless automatic single-arm 360° high-pressure water and foam showering machine that cleans any car size within 3 minutes. It cleans in a rapid, consistent and more efficient manner than manual washing.

**12.3 Why "tiny".** The world's smallest gantry for a single-arm configuration. Reduced component count means lower floor-space requirement.

**12.4 Salient features**

- Automatic car-length detection system
- Under-chassis and wheel-wash facility
- Longest washable car in its segment: 6.1 m
- High water pressure, less water usage
- SS 304 components in water-prone areas
- Attractive compact gantry design without open flexible pipes
- Single-arm jet delivers full available water pressure and increased concentration: 22 bar from each of 13 nozzles on the top external wash

**12.5 Component callouts (hotspots)**

1. Foam shower mechanism
2. Compact-size gantry
3. Rotating arm for top external wash
4. Vehicle washing zone
5. Operating panel board with touch screen
6. Under-chassis and wheel-wash assembly
7. RCC firm base

**12.6 Engineered to last (feature cards)**

- No air compressor, so no pneumatic components. No detergent pump, which lowers power consumption.
- Advanced gantry stabilisation system on the track for noiseless operation, which also eliminates wear and tear.
- Significantly reduced component count, which reduces operational and maintenance complexity.
- More than one year of R&D, resulting in nearly zero maintenance for a defined period.
- Rubber-coated metal wheels for long life and improved traction.
- Lighter weight allows manual erection and removes the crane requirement.
- Advanced foaming technology.
- Heavily reinforced structure to withstand high-pressure dynamic water loads, with improved structural stability.
- Compact, simple design for the lowest maintenance.
- All sensitive components secured under the gantry cover, away from water droplets.
- High-pressure pump for manual wash.

**12.7 Components and facilities**

- Makes: Tata Steel, Lubi pump, Pepperl+Fuchs advanced sensors, Siemens PLC, Crompton motor, NTN (Japan) bearings, SS304 hardware.
- Controls: cycle count mode, 4-inch touch-screen display, individual cycle run facility, voltage and component trip indicator, variable frequency drive for power saving, vibration-less operation.

**12.8 Specs (from the dimension drawing; units assumed mm, confirm)**

- Max wash height: 2225
- Max wash length: 6922
- Longest washable car: 6.1 m

Render supplier names as text wordmarks. Use logos only if the client confirms permission.

**12.9 Voice and copy rules**

- Headlines are sentence case, declarative, **ending in a period**. Buttons and labels don't take periods.
- No all-caps, no `text-transform`, no letter-spacing, no italics.
- Draft headings (editable in `content.ts`): "Tank's tiny." · "Fewer parts." / "Lighter build." / "Manual erection, no crane." · "Meet Tank's tiny." · "Why the name tiny." · "Built around what matters." · "Engineered to last." · "Specs and components." · "About Tank's." · "The next machine is on its way." · "Let's talk."
- Body copy comes from §12.1–12.8, unchanged apart from the flagged typo fixes.

---

## 13. Copy and claims to flag (don't silently change; list in `DECISIONS.md`)

- Two versions of the About text were supplied. Use the later, longer one (§12.1).
- Typos fixed: "concertation" → "concentration", "magine" → "machine", "Pepperl and fuchs" → "Pepperl+Fuchs".
- Marketing claims need client substantiation: "world's smallest gantry", "first and only", "any car size" (vs. the 6.1 m max), "within 3 minutes", "nearly zero maintenance".
- Confirm that 6922 (wash length) and the 6.1 m max car length are consistent and in the units assumed.

---

## 14. Phases

**Phase 0: Asset audit.** GLB report, optimised desktop and mobile GLBs, parts map, decisions on the base, backdrop and fasteners.

**Phase 1: Foundation + scroll spike.**

- Vite + TS, tokens, fonts, all §8 primitives, layout shell, content file, static responsive sections with `.reveal` + `data-scroll`.
- Dev-only **`/styleguide`** rendering every component in every state (default, hover, focus, disabled, error) and every type role.
- `ScrollProvider`, `scrollBus`, `useSectionProgress`, sticky pin tracks, and a dev-only **`/scroll-lab`** route. Verify and record in **`SCROLL-NOTES.md`**:
  1. StrictMode mount → unmount → mount leaves exactly one live instance and no duplicate listeners. Toggling the route repeatedly doesn't leak.
  2. Sticky pinning is jitter-free with the engine running on desktop Chrome, Safari and Firefox, plus iOS Safari and Android Chrome.
  3. `--progress` behaviour for `data-scroll-position` / `data-scroll-offset` combinations on (a) an element already in the fold, (b) a mid-page element, (c) a tall element. Record a table and choose the values for the hero drift and the SVG line-draw.
  4. `data-scroll-to` offset sign and value with the floating nav pill.
  5. `stop()` / `start()` locking for the menu and sheet, and `data-lenis-prevent` for sheet content.
  6. GSAP ticker sharing via `initCustomTicker` (no second RAF) with `lagSmoothing(0)`.
  7. Touch: parallax off, scrolling native.
  8. `addScrollElements` / `removeScrollElements` for a lazily mounted element.
  9. Reduced-motion path.
  10. Hash on load and scroll restoration.
- Add `scripts/check-design-rules.mjs` (§15).

**Phase 2: Scene base.** Canvas, loader, lighting, materials, scattered hero state, hero H1 effect, pointer parallax, `sceneDirector` wired to hero segment.

**Phase 3: Assembly.** Scatter generator, choreography, camera path, pinned scrub, hotspots.

**Phase 4: Feature tour.** Focus and dim system, remaining sections, SVG dimension drawing, counters.

**Phase 5: Mobile pass.** Portrait framing, bottom sheets, DPR and asset tiering, damping, fallbacks, device testing.

**Phase 6: Polish.** A11y, reduced motion, SEO and prerender, form integration, performance tuning, `README`.

---

## 15. Design and architecture guardrails: `npm run check:design`

`scripts/check-design-rules.mjs` fails if it finds, in `src/**` (excluding `tokens.css`):

- hex/rgb/hsl colour literals;
- `box-shadow` other than `var(--shadow-segment-active)`;
- `text-transform`, `font-style: italic`, or non-zero `letter-spacing`;
- raw `font-weight` / `font-size` numbers or px `border-radius` values (other than via tokens);
- any use of `--color-accent` outside the two sanctioned Badges;
- any interactive element (button, link-as-button, toggle, badge) without `radius-full`;
- imports of `lenis`, `lenis/react`, `@studio-freight/react-lenis`, or any v4-style Locomotive wrapper;
- removed v4 attributes in markup or JSX: `data-scroll-container`, `data-scroll-section`, `data-scroll-sticky`, `data-scroll-delay`, `data-scroll-direction`, `data-scroll-target`;
- ScrollTrigger `pin` / `pinSpacing`;
- `overflow`, `overflow-x` or `overflow-y` set to `hidden`, `auto` or `scroll` on `html`, `body`, `#root` or `main`;
- `new LocomotiveScroll(` anywhere except `ScrollProvider.tsx`.

---

## 16. Acceptance criteria

- The hero heading is visible before the GLB finishes loading, and the model loads with a visible progress state.
- Assembly scrubs smoothly in both directions with no popping. The final pose exactly matches the original GLB assembly.
- ~60 fps on desktop and smooth on a mid-range Android phone. No layout shift from pinning or the iOS toolbar.
- Exactly one scroll engine (Locomotive Scroll v5). No direct `lenis` import, no ScrollTrigger pins. Mounting and unmounting leaves no live listeners or extra instances.
- Sticky pin stages work on iOS Safari and Android Chrome. Parallax is off on touch, and on reduced motion the machine is shown assembled and static.
- No horizontal scroll at any width (320–1920px). All content is reachable and readable with 3D and the scroll engine disabled.
- `check:design` passes. `/styleguide` shows every component and role. `SCROLL-NOTES.md` records the verified behaviours.
- Swapping values in `tokens.css` re-themes the DOM and the 3D scene (via `token()`), with no component edits.
- Accent blue appears exactly twice site-wide (the two Badges), never on a CTA. Zero shadows on UI chrome apart from the segmented-control active pill.
- Lighthouse (mobile): Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95, Performance ≥ 70. All text pairs pass AA.
- No console errors and no third-party runtime asset dependencies.

---

## 17. Open questions for the client (carry as TODOs)

- Logo as single-colour (ink and white) SVGs, plus a logomark for the mobile nav. Should the brand brown ever appear, or is the site strictly monochrome with the machine supplying colour?
- Contact phone, email, WhatsApp and address.
- Permission to show supplier names or logos.
- Any product photos or video.
- Languages needed (English only?).
- Where form leads go.
- The Product 2 teaser (name or silhouette allowed?).
- Domain and hosting.
- Approval of the heading and tagline drafts (§12.9) and the feature groupings (§6.6).
