---
name: impeccable-design
description: >
  Visual design quality enforcement. 46 deterministic anti-pattern rules preventing
  AI design slop. Bans generic fonts, pure colors, nested cards, dated animations.
  Makes interfaces feel premium, not AI-generated.
---

# Impeccable Design — Visual Quality Enforcement

Based on [pbakaus/impeccable](https://github.com/pbakaus/impeccable) — 46 deterministic detector rules for AI-generated frontend design.

## Core Principle

> Every model is trained on the same SaaS templates. Skip this guidance and you get the same handful of tells on every project. Impeccable eliminates them.

---

## The 46 Anti-Pattern Rules

### Typography (Rules T1–T10)

| Rule | Anti-Pattern | Correct Approach |
|------|-------------|-----------------|
| T1 | Using Inter for all text | Use Inter for UI, pair with a distinct display font for headings |
| T2 | Using Arial or Helvetica | Use a curated Google Font pairing |
| T3 | All text same weight | Use weight contrast: 700 headings, 400 body, 500 labels |
| T4 | Line height = 1 (tight) | Body: 1.6–1.8, Headings: 1.1–1.3 |
| T5 | No letter-spacing on caps | Uppercase labels: `letter-spacing: 0.08em` |
| T6 | Text too wide | Max line length: 60–75 characters (use `max-width: 65ch`) |
| T7 | Monospace only for code | Use `font-variant-numeric: tabular-nums` for number tables |
| T8 | Random font sizing | Use a consistent modular scale (1.25× or 1.333×) |
| T9 | Body text too small | Minimum 15px body, 13px captions, never smaller |
| T10 | Bold everywhere | Bold is for emphasis. Diluted if overused. |

### Color (Rules C1–C12)

| Rule | Anti-Pattern | Correct Approach |
|------|-------------|-----------------|
| C1 | Pure black `#000` | Tint toward brand: `hsl(240, 10%, 4%)` |
| C2 | Pure white `#fff` for surfaces | Near-white with warmth: `hsl(40, 30%, 97%)` |
| C3 | Gray on colored background | Check contrast — likely fails WCAG. Use white/dark |
| C4 | Purple → Blue gradient | Clichéd AI palette. Use brand-derived gradients |
| C5 | Neon primary colors | Neon = accent only, never primary surface or text |
| C6 | Too many colors | 3 colors max: primary, neutral, semantic (success/error) |
| C7 | All links same blue `#0000EE` | Style links with brand color, preserve underline |
| C8 | Disabled state = gray only | Disabled: opacity 0.4 + `cursor: not-allowed` |
| C9 | Success always green, Error always red | Check brand conflicts. Use accessible variants |
| C10 | Dark mode = inverted light mode | Dark mode needs separate palette, not CSS invert |
| C11 | No hover state change | Hover: shift lightness 8–12%, add subtle transition |
| C12 | Brand color on dark surface loses identity | Adjust saturation/lightness for dark bg context |

### Layout & Spacing (Rules L1–L10)

| Rule | Anti-Pattern | Correct Approach |
|------|-------------|-----------------|
| L1 | Cards inside cards | One level of card depth maximum |
| L2 | Icon tile above every heading | Use icons inline, in context, not decoratively above text |
| L3 | Centered long paragraphs | Center-align max 2 lines. Left-align body copy |
| L4 | Inconsistent spacing | Use spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px |
| L5 | Zero whitespace between sections | Sections need breathing room: 64–96px between |
| L6 | Content touching edges | Always minimum 16px horizontal padding on mobile |
| L7 | Same visual weight everywhere | Use hierarchy: primary > secondary > tertiary zones |
| L8 | Grid breaks on tablet | Test at 768px. Use 4-col on tablet, 12-col on desktop |
| L9 | Full-width everything | Max content width: 1200–1440px, centered |
| L10 | Missing grid alignment | Use CSS Grid, not floats or manual positioning |

### Components (Rules K1–K8)

| Rule | Anti-Pattern | Correct Approach |
|------|-------------|-----------------|
| K1 | Two filled buttons side-by-side | Primary filled + Ghost secondary |
| K2 | Button without loading state | Always add spinner/disabled state during async actions |
| K3 | Modal without backdrop blur | Add `backdrop-filter: blur(4px)` to overlays |
| K4 | Empty states left blank | Design empty states with illustration + CTA |
| K5 | No skeleton screens | Use skeleton loaders (not spinners) for content areas |
| K6 | Tooltip on click (not hover) | Tooltips on hover, modals on click |
| K7 | Dropdown without keyboard nav | Arrow keys must work. Escape must close. |
| K8 | Table without row hover | Add hover: `background: rgba(255,255,255,0.03)` |

### Animation (Rules A1–A8)

| Rule | Anti-Pattern | Correct Approach |
|------|-------------|-----------------|
| A1 | Bounce/elastic easing | Use cubic-bezier easing, never spring physics in CSS |
| A2 | Animations that take > 400ms | Micro: 100–150ms, Components: 200–300ms, Pages: 300–400ms |
| A3 | Animations everywhere | Animate max 2–3 elements simultaneously |
| A4 | Same animation for enter and exit | Enter: ease-out (decelerate), Exit: ease-in (accelerate) |
| A5 | Animating expensive properties | Only animate `transform` and `opacity` — never `height`, `width`, `top` |
| A6 | No animation on mobile | Respect `prefers-reduced-motion: reduce` |
| A7 | Scroll-triggered animations that block | Don't block content visibility for scroll reveals |
| A8 | Hover animations on touch devices | Wrap hover effects in `@media (hover: hover)` |

### Images & Icons (Rules I1–I8)

| Rule | Anti-Pattern | Correct Approach |
|------|-------------|-----------------|
| I1 | Decorative icons on every list item | Icons add meaning, not decoration. Use selectively. |
| I2 | Mix of icon styles | Pick one icon set. Stick with it. |
| I3 | Low-contrast icons | Icons need ≥ 3:1 contrast ratio |
| I4 | Images without aspect-ratio | Always set `aspect-ratio` to prevent layout shifts |
| I5 | No image loading state | Use low-res blur placeholder or skeleton |
| I6 | SVG icons inline without aria | Add `aria-hidden="true"` or `aria-label` |
| I7 | Stock photo generic humans | Use illustrations, abstract art, or genuine brand photography |
| I8 | Unoptimized images | WebP/AVIF, properly sized, lazy-loaded below fold |

---

## Design Initialization Checklist

Start every new design with:

```markdown
## Design Context

**Surface type**: [brand/marketing OR product/app]
**Target audience**: [who are they? what do they value?]
**Brand tone**: [professional/playful/bold/minimal/technical]
**Anti-references**: [designs this should NOT look like]
**Primary font**: [chosen font + why]
**Color palette**: [3 semantic colors + hex/hsl]
**Component library**: [none/shadcn/radix/custom]
```

---

## Design Review Commands

Before shipping any frontend, run through these audits:

### Quick Audit
- Typography: Is there clear visual hierarchy? Are fonts intentional?
- Color: Any pure black/white? Contrast failures? Too many colors?
- Spacing: Consistent scale? Enough whitespace?
- Animation: Any bounce/elastic? Too slow? Too many?

### Full Audit
- Accessibility: Run axe DevTools or Lighthouse
- Responsiveness: Test at 375px, 768px, 1280px, 1440px
- Dark mode: Does the palette hold up?
- Edge cases: Empty states, loading, errors, long text, RTL

---

## Premium Design Markers

These details separate premium from mediocre:

1. **Consistent border radius** — pick one and use it everywhere (4px/8px/12px)
2. **Intentional drop shadows** — darker near surface, lighter for floating elements
3. **Micro-copy quality** — button labels are verbs: "Save changes" not "Submit"
4. **Focus ring styling** — custom focus rings matching brand color
5. **Smooth color transitions** — hover states use CSS transitions, not instant jumps
6. **Optical alignment** — icon + text optically centered, not mathematically
