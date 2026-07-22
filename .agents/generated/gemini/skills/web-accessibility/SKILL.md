---
name: Web Accessibility
description: >
  ContextOS skill for Web Accessibility
---


<!-- Source: accessibility.md -->

# Web Accessibility — WCAG 2.1 Compliance

## Principles (POUR)

1. **Perceivable** — content can be perceived by all users
2. **Operable** — interface can be operated by all users
3. **Understandable** — content and interface are understandable
4. **Robust** — content works across assistive technologies

## Keyboard Navigation

- All interactive elements must be reachable with Tab
- Focus order must be logical (DOM order)
- Custom widgets need keyboard handlers (Enter, Space, Escape, Arrow keys)
- Visible focus indicator on all interactive elements (never `outline: none` without replacement)
- Skip navigation link for repeated content

## Semantic HTML

- Use `<button>` not `<div onClick>` for actions
- Use `<a href>` for navigation
- Use heading hierarchy (`<h1>` → `<h2>` → `<h3>`)
- Use `<nav>`, `<main>`, `<article>`, `<aside>` landmarks
- Use `<label>` with every form input

## ARIA (when HTML alone isn't enough)

- `aria-label` — label for screen readers when no visible text
- `aria-labelledby` — reference to existing visible text
- `aria-describedby` — additional description
- `aria-live="polite"` — announce dynamic changes
- `aria-expanded` — for collapsible sections
- `aria-hidden="true"` — hide decorative elements

**Rule: no ARIA is better than bad ARIA.** Use semantic HTML first.

## Color and Contrast

- Text contrast: 4.5:1 minimum (AA), 7:1 (AAA)
- Large text (18px+ bold, 24px+ regular): 3:1 minimum
- Never use color alone to convey information
- Test with grayscale filter

## Images

- All images need `alt` text
- Decorative images: `alt=""`
- Complex images: `aria-describedby` with longer description
- SVG icons: `role="img"` + `aria-label`

## Forms

- Every input needs a visible `<label>`
- Error messages linked with `aria-describedby`
- Required fields marked with `aria-required="true"`
- Group related fields with `<fieldset>` + `<legend>`

## Testing

- Automated: axe-core, Lighthouse accessibility audit
- Manual: keyboard-only navigation test
- Screen reader: test with NVDA (Windows), VoiceOver (Mac)
- Zoom: test at 200% and 400% zoom


<!-- Source: EXAMPLES.md -->

# Code Examples

Add detailed code examples and implementations here.


<!-- Source: SKILL.md -->

---
name: Web Accessibility
description: >
  ContextOS skill for Web Accessibility
---

# Web Accessibility

## Overview
A brief summary of what the skill does and its core philosophy.

## When to Use
Context for when this skill is applicable.

## Rules & Patterns
<!-- Source: accessibility.md -->

# Web Accessibility — WCAG 2.1 Compliance

## Principles (POUR)

1. **Perceivable** — content can be perceived by all users
2. **Operable** — interface can be operated by all users
3. **Understandable** — content and interface are understandable
4. **Robust** — content works across assistive technologies

## Keyboard Navigation

- All interactive elements must be reachable with Tab
- Focus order must be logical (DOM order)
- Custom widgets need keyboard handlers (Enter, Space, Escape, Arrow keys)
- Visible focus indicator on all interactive elements (never `outline: none` without replacement)
- Skip navigation link for repeated content

## Semantic HTML

- Use `<button>` not `<div onClick>` for actions
- Use `<a href>` for navigation
- Use heading hierarchy (`<h1>` → `<h2>` → `<h3>`)
- Use `<nav>`, `<main>`, `<article>`, `<aside>` landmarks
- Use `<label>` with every form input

## ARIA (when HTML alone isn't enough)

- `aria-label` — label for screen readers when no visible text
- `aria-labelledby` — reference to existing visible text
- `aria-describedby` — additional description
- `aria-live="polite"` — announce dynamic changes
- `aria-expanded` — for collapsible sections
- `aria-hidden="true"` — hide decorative elements

**Rule: no ARIA is better than bad ARIA.** Use semantic HTML first.

## Color and Contrast

- Text contrast: 4.5:1 minimum (AA), 7:1 (AAA)
- Large text (18px+ bold, 24px+ regular): 3:1 minimum
- Never use color alone to convey information
- Test with grayscale filter

## Images

- All images need `alt` text
- Decorative images: `alt=""`
- Complex images: `aria-describedby` with longer description
- SVG icons: `role="img"` + `aria-label`

## Forms

- Every input needs a visible `<label>`
- Error messages linked with `aria-describedby`
- Required fields marked with `aria-required="true"`
- Group related fields with `<fieldset>` + `<legend>`

## Testing

- Automated: axe-core, Lighthouse accessibility audit
- Manual: keyboard-only navigation test
- Screen reader: test with NVDA (Windows), VoiceOver (Mac)
- Zoom: test at 200% and 400% zoom



## Code Examples
See `EXAMPLES.md` for detailed code examples.

## Validation Checklist
What to verify during the review phase before completing the task.

## Common Mistakes
Anti-patterns and things to explicitly avoid. See `TROUBLESHOOTING.md`.

## Integration Notes
How this skill interacts with other skills.


<!-- Source: TROUBLESHOOTING.md -->

# Troubleshooting & Common Mistakes

Add common errors, anti-patterns, and debugging steps here.

