# Product

## Register

product

## Users

Two overlapping groups: (1) authenticated authors managing their own blog articles — create, edit, delete, browse their own list with pagination; (2) anyone (logged in or not) discovering and reading articles via the public search and author directory. Context: this is a fullstack technical test (trainee/junior evaluation, see TASK.md) — the actual "user" grading it is an evaluator judging functional completeness, code clarity, and UX polish, but the interface should read as a real, usable blog-management tool, not a demo shell.

## Product Purpose

A simple blog article manager: authenticated users write and manage their own articles (title, content, optional cover image); anyone can search articles by title/content/author and browse the author directory. Success = every required flow (auth, CRUD with server-side ownership, public search) works cleanly and feels like a considered product, not a bare CRUD scaffold.

## Brand Personality

Modern/bold + warm/personal. Confident, not corporate-sterile — a content tool that feels like it belongs to the person writing in it, with enough visual confidence (real color commitment, clear hierarchy) that it doesn't read as an unstyled admin panel. Avoid generic SaaS-dashboard blandness on one end and precious editorial/magazine styling on the other.

## Anti-references

- Generic "AI-generated SaaS" look: cream/sand neutral body bg, tiny uppercase tracked eyebrows, identical icon+heading+text card grids, gradient text, hero-metric blocks.
- Bare-bones unstyled admin CRUD (plain HTML tables, no hierarchy, no personality) — the starting point being restyled away from.
- Precious magazine/editorial overdesign that would fight the tool-first (product) register.

## Design Principles

- Function first, styled with confidence — every screen is a real workflow (write, edit, search, read), not a decorative surface.
- One consistent shell (nav, spacing, type scale, color system) established early (root layout) that every subsequent page reuses rather than reinvents.
- Public pages (search, authors, article detail) share the same visual system as private/app pages — same brand, just reading-oriented content.
- Server-validated ownership is a security fact, not just a UI toggle — the UI should visually reflect owner-only actions clearly (edit/delete) without implying the frontend is the real gate.
- Respect the required stack (HeroUI + Tailwind v4) — extend and theme it, don't fight it or bypass it with one-off custom components.

## Accessibility & Inclusion

Standard: solid color contrast (body text ≥4.5:1), visible focus states, correct semantic HTML/ARIA via HeroUI components, works on desktop and mobile (hard requirement from TASK.md). No specific WCAG level mandated beyond that.
