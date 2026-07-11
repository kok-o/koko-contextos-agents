---
name: ui-ux-pro
description: >
  Professional UI/UX design skill. Enforces accessibility, semantic color palettes,
  proper spacing, and bans all common AI design anti-patterns and clichés.
---

# UI/UX Pro — Professional Design Intelligence

Inspired by [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

## Core Principle

> Great design is invisible. Bad design is obvious. You will never produce obvious AI design.

---

## ❌ Absolute Prohibitions (Never Do These)

### Typography Anti-Patterns
- **NEVER** use Arial, Helvetica, or system-ui defaults as primary fonts
- **NEVER** use Inter for everything — it is the #1 AI slop signal
- **NEVER** mix more than 2 font families
- **ALWAYS** import proper fonts from Google Fonts or similar

### Color Anti-Patterns
- **NEVER** use pure black `#000000` — always tint toward brand hue (e.g. `#0A0A0F`)
- **NEVER** use pure gray `#808080` — tint it (e.g. `#6B7280` has blue undertones)
- **NEVER** use purple-to-blue gradients — it is the #1 "AI generated" visual tell
- **NEVER** use neon colors for primary UI (only accents, sparingly)
- **ALWAYS** use HSL-based semantic palettes with clear naming

### Layout Anti-Patterns
- **NEVER** nest cards inside cards (card-in-card = instant slop flag)
- **NEVER** put a rounded-square icon tile above every heading
- **NEVER** center-align long paragraphs (> 2 lines)
- **NEVER** use gray text on colored backgrounds (contrast failure)

### Animation Anti-Patterns
- **NEVER** use bounce or elastic easing — it feels dated (circa 2014)
- **NEVER** add animations just to show they work
- **ALWAYS** use `ease-out` for enter, `ease-in` for exit, `ease-in-out` for continuous

---

## ✅ Required Standards

### Accessibility Checklist
Before shipping any UI, verify:
- [ ] Text contrast ratio ≥ 4.5:1 for normal text (WCAG AA)
- [ ] Text contrast ratio ≥ 3:1 for large text (≥ 18px bold or ≥ 24px)
- [ ] All interactive elements have `aria-label` or visible text
- [ ] Touch targets are minimum 44×44px (48×48px recommended)
- [ ] Focus states are visible and styled (not just browser default)
- [ ] Images have meaningful `alt` text (or `alt=""` if decorative)
- [ ] Form fields have associated `<label>` elements
- [ ] Keyboard navigation works without mouse
- [ ] No color alone conveys information (use icons + text too)

### Semantic Color Palette Structure
Always define colors semantically, not as raw values:

```css
/* ✅ Correct: Semantic naming */
--color-surface-primary: hsl(220, 13%, 9%);
--color-surface-secondary: hsl(220, 11%, 13%);
--color-text-primary: hsl(210, 40%, 98%);
--color-text-secondary: hsl(215, 16%, 65%);
--color-accent: hsl(258, 90%, 66%);
--color-accent-hover: hsl(258, 90%, 72%);
--color-border: hsl(217, 19%, 22%);
--color-success: hsl(142, 76%, 36%);
--color-error: hsl(0, 84%, 60%);

/* ❌ Wrong: Raw value naming */
--purple: #8B5CF6;
--dark-bg: #111827;
```

### Spacing System
Use an 8px base grid. All spacing should be multiples of 4 or 8:
- `4px` — micro gaps (icon-to-text)
- `8px` — component internal padding
- `16px` — standard component padding
- `24px` — section gaps
- `32px` — block separators
- `48/64px` — section separators
- `80/128px` — hero/major section spacing

### Typography Scale
Use a modular type scale (1.25 or 1.333 ratio):

```
xs:  11px / 0.688rem
sm:  13px / 0.813rem
base: 16px / 1rem
lg:  20px / 1.25rem
xl:  24px / 1.5rem
2xl: 32px / 2rem
3xl: 40px / 2.5rem
4xl: 56px / 3.5rem
```

---

## Design Domains

### Product UI (SaaS / Dashboard / App)
- Functional over decorative
- Dense information where needed (use compact variants)
- Table zebra striping: use `5%` opacity, not hard borders
- Data visualization: prefer Chart.js or Recharts, label all axes
- Loading states: skeleton screens, never spinners alone

### Marketing / Landing Pages
- Hero: full viewport height, one clear CTA
- Social proof above the fold when possible
- CTA buttons: filled primary + ghost secondary (never two filled)
- Testimonials: real photos, full name, company

### Forms
- Label above field (not placeholder-as-label)
- Inline validation (show errors on blur, not on submit)
- Group related fields visually
- Progress indicator for multi-step flows

---

## UI Style Toolkit

### Glassmorphism (Use Sparingly)
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Subtle Shadows (Dark UI)
```css
/* Card elevation */
box-shadow: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6);
/* Floating element */
box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
```

### Recommended Micro-animations
```css
/* Standard transition */
transition: all 0.15s ease-out;
/* Hover lift */
transform: translateY(-2px);
/* Button press */
transform: scale(0.97);
/* Fade in */
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } }
```

---

## Domain Search Guide

When choosing styles, reference these domains:
- `style` — UI style options (glassmorphism, neobrutalism, minimalism)
- `typography` — Font pairing recommendations  
- `color` — Color palettes by product type
- `ux` — Best practices and anti-patterns
- `gsap` — Animation patterns by intensity (hover, scroll, transition)
