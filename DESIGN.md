---
name: Blog Manager
description: Article-writing and reading tool — product register, olive-moss primary with terracotta accent, Fraunces/Inter type pairing
colors:
  primary: "oklch(0.52 0.14 112)"
  primary-hover: "oklch(0.45 0.13 112)"
  primary-soft: "oklch(0.97 0.02 112)"
  accent: "oklch(0.62 0.15 50)"
  accent-soft: "oklch(0.97 0.02 50)"
  ink: "oklch(0.20 0.02 112)"
  muted: "oklch(0.52 0.015 112)"
  bg: "oklch(1 0 0)"
  surface: "oklch(0.97 0.01 112)"
  divider: "oklch(0.90 0.012 112)"
  danger: "#EF4444"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontWeight: 600
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  nav-link-active:
    textColor: "{colors.primary}"
---

## Overview

A blog article manager: a tool for writing/managing articles (product register) that also serves public reading/search pages using the same visual system. Personality: modern/bold + warm/personal — confident color commitment (a real primary, used deliberately) paired with a warm serif for headings so the app doesn't read as a bare admin CRUD, without tipping into precious magazine styling. One consistent shell (nav, spacing, type scale) established in the root layout; every other page reuses it rather than reinventing chrome.

## Colors

### Primary

`oklch(0.52 0.14 112)` — deep olive-moss. Carries the brand: primary buttons, active nav state, logo mark, focus rings, links. Hex equivalent used in HeroUI's theme config (which requires hex/rgb, not oklch): `#6C6F00` DEFAULT, with a generated 50–900 scale (see `tailwind.config.js`). White text on filled primary (mid-luminance saturated fill — WCAG ≈5.4:1).

### Secondary / Accent

`oklch(0.62 0.15 50)` — warm terracotta. Used sparingly: badges (e.g. article/owner tags), highlighted counts, secondary CTAs. Distinct hue *and* lightness from primary so the two never get confused. Hex DEFAULT: `#CB6620`. White text on filled accent.

### Neutral

- `bg`: pure white `oklch(1 0 0)` — the warmth lives in primary/accent + typography, not the page background.
- `surface`: `oklch(0.97 0.01 112)` — cards, panels, hover rows; olive-tinted toward the brand hue, not generic gray.
- `ink`: `oklch(0.20 0.02 112)` — body text, ~15:1 on white.
- `muted`: `oklch(0.52 0.015 112)` — secondary text, timestamps, helper copy (~4.3:1 on white).
- `divider`: `oklch(0.90 0.012 112)` — hairline borders.

### Named Rules

- Never gray-on-gray for anything a user needs to read as body copy — use `ink`, not `muted`, for primary content.
- Saturated fills (primary/accent buttons, badges) always take white text, never dark text on the fill.
- Don't introduce a second unrelated hue (e.g. default HeroUI blue) for anything — every color on screen is primary, accent, neutral, or a semantic state color (danger/success/warning, HeroUI defaults are fine for those since they're system-meaning, not brand).

## Typography

- **Display** (`h1`–`h2`, hero-scale headings, article titles on detail pages): Fraunces, weight 600, letter-spacing -0.02em, `text-wrap: balance`. This is where "warm/personal" shows up — Fraunces has soft, characterful curves unlike a generic grotesk.
- **Body/UI** (everything else — nav, buttons, forms, article body, `h3`+ subheadings): Inter, 400/500/600 weights only. This is where "modern/bold" and product-register legibility live.
- Load both via Google Fonts `<link>` in `index.html` (no local hosting needed for a 7-day test project).

### Hierarchy

`h1` ~2.25–3rem clamp (Fraunces 600) → `h2` ~1.5–1.875rem (Fraunces 600) → `h3` ~1.125rem (Inter 600) → body 1rem (Inter 400) → `muted`/meta text 0.875rem (Inter 400, `muted` color).

### Named Rules

- Never pair Fraunces with anything but Inter for body — no third typeface.
- Article titles (on cards, detail pages) always render in Fraunces; UI chrome (buttons, nav, form labels) always in Inter. Don't mix these roles.

## Layout

Single shared shell: sticky top nav (HeroUI `Navbar`) + centered content column, `max-w-5xl` (matches existing convention), responsive padding (`px-4` mobile → more breathing room on desktop via the max-width cap, not extra horizontal padding). Nav collapses to a HeroUI `NavbarMenuToggle` hamburger below `sm`. Vertical rhythm uses the `spacing` scale (`sm`/`md` for component-internal gaps, `lg`/`xl` for section breaks) — vary spacing deliberately rather than one uniform gap everywhere.

## Elevation & Depth

Mostly flat — this is a content/product tool, not a glassy dashboard. Reserve shadow for genuinely elevated layers only: the mobile nav menu overlay and dropdowns/popovers (HeroUI defaults, `shadow-medium`). No shadow on static cards/sections; use `divider` borders or `surface` background instead.

## Shapes

Rounded, not sharp: `rounded.sm` (8px) for buttons/inputs/badges, `rounded.md` (12px) for cards/panels, `rounded.lg` (16px) for larger containers (modals, cover-image frames). Consistent radius scale reused everywhere — no ad hoc radius values.

## Components

### Buttons

Primary action = filled `primary` bg, white text, `rounded.sm`. Secondary/tertiary actions = HeroUI `bordered`/`light` variants in `ink`/`muted`, never a second filled color competing with primary. Destructive actions (delete article) = HeroUI `danger` color, filled only behind a confirm step.

### Navigation

HeroUI `Navbar`, sticky top, `surface`-tinted on scroll (subtle, not a hard shadow). Active route gets `primary` text color + medium weight, not an underline. Auth-aware right-hand cluster (as today): guest → Login/Register links; authenticated → Profile link + sign-out.

### Cards / Containers

Article/author list rows: `surface` background on hover, `divider` border, `rounded.md`. Avoid nested cards (a card inside a card) — list rows are rows, not boxed cards, unless they're genuinely a grid of independent items (e.g. author directory tiles).

### Inputs / Fields

HeroUI default inputs, themed to the primary color for focus rings (`primary` at reduced opacity), `rounded.sm`.

## Do's and Don'ts

### Do:

- Keep the whole site on this one palette + type pairing — public pages (search, authors, article detail) and private pages (profile, forms) share the identical system.
- Let primary carry the "bold" personality via deliberate placement (CTAs, active nav, focus), not by drenching every surface in it.
- Use Fraunces only for genuine headings/titles, never for UI chrome or body paragraphs.

### Don't:

- Don't introduce a cream/sand tinted page background "for warmth" — warmth comes from primary/accent/type, bg stays pure white.
- Don't add a second accent color beyond primary + accent + HeroUI semantic (danger/success/warning) colors.
- Don't use side-stripe borders, gradient text, or tiny uppercase eyebrow labels above sections.
