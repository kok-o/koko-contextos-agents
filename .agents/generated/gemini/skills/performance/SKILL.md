---
name: Web Performance
description: >
  ContextOS skill for Web Performance
---


<!-- Source: EXAMPLES.md -->

# Code Examples

Add detailed code examples and implementations here.


<!-- Source: performance.md -->

# Web Performance — Best Practices

## Core Web Vitals

| Metric | Target | What it measures |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | < 2.5s | Loading performance |
| INP (Interaction to Next Paint) | < 200ms | Responsiveness |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |

## Loading Performance

- **Code splitting** — split by route, lazy load non-critical components
- **Tree shaking** — use ES modules, avoid side-effect imports
- **Image optimization** — WebP/AVIF, responsive srcset, lazy loading
- **Font loading** — `font-display: swap`, preload critical fonts
- **Critical CSS** — inline above-the-fold styles
- **Preconnect** — `<link rel="preconnect">` for third-party origins

## Runtime Performance

- **Avoid layout thrashing** — batch DOM reads and writes
- **Debounce/throttle** — expensive event handlers (scroll, resize, input)
- **Web Workers** — offload heavy computation
- **Virtualize long lists** — render only visible items
- **Avoid synchronous operations** — use async/await, requestIdleCallback

## Bundle Optimization

- **Analyze bundle** — use webpack-bundle-analyzer or similar
- **Dynamic imports** — `import()` for heavy libraries
- **Avoid barrel exports** — they prevent tree shaking
- **Vendor splitting** — separate vendor chunks for caching
- **Compression** — Brotli > gzip

## Caching Strategy

| Asset | Cache | Strategy |
| --- | --- | --- |
| HTML | Short (5min) | Revalidate |
| JS/CSS (hashed) | Long (1 year) | Immutable |
| Images | Long (1 year) | Immutable |
| API responses | Depends | stale-while-revalidate |
| Fonts | Long (1 year) | Immutable |

## Anti-Patterns

- ❌ Importing entire libraries (`import _ from 'lodash'`)
- ❌ Unoptimized images (PNG > 500KB)
- ❌ Blocking scripts in `<head>` without `defer`
- ❌ Layout shifts from dynamic content (no dimensions on images)
- ❌ Premature optimization — measure first, optimize second


<!-- Source: SKILL.md -->

---
name: Web Performance
description: >
  ContextOS skill for Web Performance
---

# Web Performance

## Overview
A brief summary of what the skill does and its core philosophy.

## When to Use
Context for when this skill is applicable.

## Rules & Patterns
<!-- Source: performance.md -->

# Web Performance — Best Practices

## Core Web Vitals

| Metric | Target | What it measures |
| --- | --- | --- |
| LCP (Largest Contentful Paint) | < 2.5s | Loading performance |
| INP (Interaction to Next Paint) | < 200ms | Responsiveness |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |

## Loading Performance

- **Code splitting** — split by route, lazy load non-critical components
- **Tree shaking** — use ES modules, avoid side-effect imports
- **Image optimization** — WebP/AVIF, responsive srcset, lazy loading
- **Font loading** — `font-display: swap`, preload critical fonts
- **Critical CSS** — inline above-the-fold styles
- **Preconnect** — `<link rel="preconnect">` for third-party origins

## Runtime Performance

- **Avoid layout thrashing** — batch DOM reads and writes
- **Debounce/throttle** — expensive event handlers (scroll, resize, input)
- **Web Workers** — offload heavy computation
- **Virtualize long lists** — render only visible items
- **Avoid synchronous operations** — use async/await, requestIdleCallback

## Bundle Optimization

- **Analyze bundle** — use webpack-bundle-analyzer or similar
- **Dynamic imports** — `import()` for heavy libraries
- **Avoid barrel exports** — they prevent tree shaking
- **Vendor splitting** — separate vendor chunks for caching
- **Compression** — Brotli > gzip

## Caching Strategy

| Asset | Cache | Strategy |
| --- | --- | --- |
| HTML | Short (5min) | Revalidate |
| JS/CSS (hashed) | Long (1 year) | Immutable |
| Images | Long (1 year) | Immutable |
| API responses | Depends | stale-while-revalidate |
| Fonts | Long (1 year) | Immutable |

## Anti-Patterns

- ❌ Importing entire libraries (`import _ from 'lodash'`)
- ❌ Unoptimized images (PNG > 500KB)
- ❌ Blocking scripts in `<head>` without `defer`
- ❌ Layout shifts from dynamic content (no dimensions on images)
- ❌ Premature optimization — measure first, optimize second



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

