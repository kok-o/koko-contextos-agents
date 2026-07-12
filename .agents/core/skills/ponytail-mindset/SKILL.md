---
name: ponytail-mindset
description: >
  Minimalist coding mindset. Write only what is strictly necessary for the task.
  7-rung decision ladder before writing any code. Reduces output ~54% while keeping
  all safety, validation, error handling, and security guards intact.
---

# Ponytail Mindset — The Lazy Senior Developer

Based on [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail).

> _He says nothing. He writes one line. It works._

**Benchmark**: 54% less code on average. 94% less in over-build scenarios. 100% safe (validation, error handling, security: never cut).

---

## Core Principle

> **The best code is code you don't write.**  
> Write only what the task strictly needs. Lazy about the solution, never about reading and understanding.

---

## The 7-Rung Decision Ladder

**Before writing ANY code**, stop and check each rung in order. Stop at the first rung that holds:

```
1. Does this need to exist?
   → No: YAGNI — skip it entirely. Don't build for "future use."

2. Already in this codebase or component library?
   → Yes: Reuse it. Don't rewrite. Call the existing function/component/module.
   → **For UI**: Check shadcn/ui FIRST. Before building a complex UI element from scratch, check if it exists in the component library. If yes, generate the install command: `npx shadcn@latest add dialog` — never manually rewrite what shadcn already provides.

3. Standard library does it?
   → Yes: Use it. Don't write `formatDate()` — use Intl.DateTimeFormat or dayjs.

4. Native platform feature?
   → Yes: Use it. Don't install flatpickr when <input type="date"> exists.
   → **Exception for UI Components**: If a native HTML element (like `<input type="date">` or `<select>`) CANNOT be styled consistently across Chrome, Safari, and Firefox to match the premium design system — use the established component library (e.g., shadcn/ui `<DatePicker>`, `<Select>`) instead. Cross-browser inconsistency is a legitimate reason to NOT use native.
             Don't install lodash.debounce when setTimeout exists.

5. Already-installed dependency?
   → Yes: Use it. Don't install a new library to do what an existing one can.

6. Can it be done in one line?
   → Yes: One line. No abstraction layer needed.

7. Only then: write the MINIMUM that works.
   → No classes when a function works. No module when an inline does.
```

---

## The Sacred Exceptions (NEVER Cut These)

The ladder applies to features and abstractions. These 4 areas are **non-negotiable** and **never simplified away**:

### 1. Input Validation

```javascript
// ✅ Always validate — even if "internal" API
function createUser(data) {
  if (!data.email || !isValidEmail(data.email)) {
    throw new ValidationError('Invalid email');
  }
  // ...
}

// ❌ Never skip validation for "speed"
function createUser(data) {
  return db.insert('users', data); // NEVER
}
```

### 2. Error Handling

```javascript
// ✅ Always handle errors explicitly
async function fetchUser(id) {
  try {
    const user = await db.findById(id);
    if (!user) throw new NotFoundError(`User ${id} not found`);
    return user;
  } catch (err) {
    logger.error('fetchUser failed', { id, err });
    throw err; // re-throw for caller to handle
  }
}

// ❌ Never silently swallow errors
async function fetchUser(id) {
  try {
    return await db.findById(id);
  } catch (e) {} // NEVER
}
```

### 3. Security Guards

```javascript
// ✅ Always check authorization before data access
app.get('/users/:id/data', authMiddleware, async (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // ...
});

// ❌ Never skip auth for "internal" routes
app.get('/users/:id/data', async (req, res) => {
  // No auth check — NEVER
});
```

### 4. Data Loss Prevention

```javascript
// ✅ Always confirm before destructive operations
async function deleteAccount(userId) {
  const user = await db.findById(userId);
  if (!user) throw new NotFoundError('User not found');
  
  await db.transaction(async (trx) => {
    await trx('user_data').where({ userId }).delete();
    await trx('users').where({ id: userId }).delete();
  });
}
```

---

## Practical Examples

### The Date Picker Problem

❌ **What AI usually does** (over-build):

```bash
npm install flatpickr
# Creates: DatePickerWrapper.jsx (45 lines)
# Creates: useDatePicker.js (30 lines)  
# Creates: DatePickerStyles.css (60 lines)
# Total: 135 lines + 1 dependency
```

✅ **Ponytail approach** (use rung 4 — native platform):

```html
<!-- ponytail: browser has one -->
<input type="date" name="date" />
```

Total: 1 line. 0 dependencies.

---

### The Utility Function Problem

❌ **Over-build**:

```javascript
// Creates entire utilities.js module
export const StringUtils = {
  capitalize: (s) => s.charAt(0).toUpperCase() + s.slice(1),
  truncate: (s, n) => s.length > n ? s.slice(0, n) + '...' : s,
  // 10 more methods "for future use"
};
```

✅ **Ponytail** (rung 6 — one line, or rung 2 — already installed):

```javascript
// If lodash is already installed (rung 5):
import { capitalize, truncate } from 'lodash';

// If not (rung 6 — one line where needed):
const label = name.charAt(0).toUpperCase() + name.slice(1);
```

---

### The API Client Problem

❌ **Over-build**:

```javascript
// Creates: ApiClient.js (200 lines of abstraction)
// Creates: HttpService.js (retry logic, interceptors, "enterprise patterns")
// Creates: ApiConfig.js (configuration layer)
```

✅ **Ponytail** (rung 3 — stdlib for client APIs):

```javascript
// fetch is built-in. Use it directly.
const user = await fetch(`/api/users/${id}`).then(r => r.json());
```

✅ **Ponytail for Next.js App Router** — skip the API route entirely (rung 2 — use what the framework provides):

```typescript
// Instead of: /api/users/[id]/route.ts + fetch wrapper
// Use a Server Action directly — no API endpoint needed:
"use server"
export async function updateUser(id: string, data: UpdateUserInput) {
  const session = await getSession() // auth check — never skip
  if (session.userId !== id) throw new Error("Forbidden")
  return db.users.update(id, data) // one line
}
// Caller: just import and call updateUser() directly from the component
```


## Decision Log Format

When the ponytail ladder prevents over-building, document it:

```javascript
// ponytail: browser's <input type="date"> chosen over flatpickr (rung 4)
// ponytail: existing `formatCurrency` in utils.js reused (rung 2)
// ponytail: inline validation instead of separate validator class (rung 6)
```

---

## What This Skill Does NOT Minimize

Do NOT apply the ladder to:

- **Tests** — write comprehensive tests, even if verbose
- **Docs** — write clear documentation, even if long
- **Error messages** — write descriptive, actionable error messages
- **Security checks** — write thorough authorization and validation
- **Accessibility** — write proper ARIA, labels, and semantic HTML

---

## Anti-Patterns This Eliminates

| Over-Build Pattern | Ponytail Response |
| --- | --- |
| "We might need this later" | YAGNI. Ship what's needed now. |
| Factory class for one object | Use a plain function |
| Interface for one implementation | Skip the interface |
| 5-file abstraction for 3 lines | Inline it |
| New library for native feature | Use rung 4 (platform native) |
| Copy-pasting existing logic | Find and reuse (rung 2) |
| Wrapper around wrapper around util | Read what's installed (rung 5) |
