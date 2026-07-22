---
name: Next.js
description: >
  ContextOS skill for Next.js
---

# Next.js

## Overview
A brief summary of what the skill does and its core philosophy.

## When to Use
Context for when this skill is applicable.

## Rules & Patterns
<!-- Source: nextjs.md -->

# Next.js — Best Practices (App Router)

## Routing

- Use **App Router** (`app/` directory) — not Pages Router
- **Layouts** — shared UI in `layout.tsx`, nested layouts for sections
- **Loading states** — `loading.tsx` for Suspense boundaries
- **Error handling** — `error.tsx` for error boundaries per route
- **Not found** — `not-found.tsx` for 404 pages

## Server vs Client Components

- **Default to Server Components** — they're server by default
- **Use `'use client'`** only when you need: event handlers, useState, useEffect, browser APIs
- **Push client boundaries down** — keep as much as possible on the server
- **Don't pass functions** from Server to Client components

## Data Fetching

- **Server Components** — fetch directly, no useEffect
- **Server Actions** — for mutations (`'use server'`)
- **Route Handlers** — `app/api/` for REST endpoints
- **Parallel fetching** — use Promise.all for independent requests
- **Caching** — leverage Next.js cache, revalidate strategically

```tsx
// Server Component — direct fetch
async function UserProfile({ id }: { id: string }) {
  const user = await getUser(id); // No useEffect needed
  return <div>{user.name}</div>;
}
```

## File Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page
├── globals.css
├── (auth)/                 # Route group (no URL impact)
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   ├── layout.tsx          # Dashboard layout
│   ├── page.tsx            # Dashboard home
│   └── settings/page.tsx
├── api/
│   └── users/route.ts      # API route
└── components/             # Shared components
```

## Performance

- **Image optimization** — always use `next/image`
- **Font optimization** — use `next/font`
- **Metadata** — export metadata object from pages
- **Static generation** — prefer SSG over SSR when possible
- **Edge runtime** — for latency-sensitive routes

## Anti-Patterns

- ❌ Using `useEffect` for data fetching in Server Components
- ❌ Making everything a Client Component
- ❌ Not using `loading.tsx` and `error.tsx`
- ❌ Importing server-only code in Client Components
- ❌ Not leveraging caching and revalidation



## Code Examples
See `EXAMPLES.md` for detailed code examples.

## Validation Checklist
What to verify during the review phase before completing the task.

## Common Mistakes
Anti-patterns and things to explicitly avoid. See `TROUBLESHOOTING.md`.

## Integration Notes
How this skill interacts with other skills.
