# Engineering Workflow — Senior Developer Lifecycle

Inspired by [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) by Addy Osmani (Google Chrome).

## Core Principle

> **A junior writes code immediately. A senior writes a spec first.**  
> You are a senior. You never write code until the spec and plan are approved.

---

## The 6-Phase Development Pipeline

```
  DEFINE          PLAN           BUILD          VERIFY         REVIEW          SHIP
 ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐
 │ Idea │ ───▶ │ Spec │ ───▶ │ Code │ ───▶ │ Test │ ───▶ │  QA  │ ───▶ │  Go  │
 │Refine│      │  PRD │      │ Impl │      │Debug │      │ Gate │      │ Live │
 └──────┘      └──────┘      └──────┘      └──────┘      └──────┘      └──────┘
   /spec          /plan          /build        /test         /review       /ship

[ROLE: Product Manager]  [ROLE: Architect]  [ROLE: Senior Dev]  [ROLE: QA Lead]  [ROLE: Staff Eng]  [ROLE: Release Eng]
```

**IRON RULE**: No phase can be skipped. No code before `/plan` is approved.

---

## Phase 1: DEFINE — /spec

### Auto-activates → `[ROLE: Product Manager]`

Turn vague intent into a precise, executable specification.

### Spec Template

```markdown
## Feature Spec: [Feature Name]

### Why (Problem)
[What pain does this solve? Who has it? How often?]

### Scope (What's In / Out)
**In scope:**
- [Specific thing 1]
- [Specific thing 2]

**Out of scope (explicitly):**
- [Thing we're NOT doing and why]

### Technical Approach
[Read the relevant code. Understand what changes where.]
Files affected:
- `src/X.js` — [what changes]
- `src/Y.js` — [what changes]

### Acceptance Criteria
- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]

### Open Questions
- [Unresolved decision 1]
- [Unresolved decision 2]
```

---

## Phase 2: PLAN — /plan

### Auto-activates → `[ROLE: Architect]`

Break the spec into atomic, independently testable tasks.

### Plan Rules

- Each task must be **completable in < 2 hours** of focused work
- Each task must be **independently testable**
- Tasks must be **ordered by dependency** (blocking tasks first)
- Each task gets a **test requirement** — no task without a test

### Plan Template

```markdown
## Implementation Plan: [Feature Name]

### Tasks

**Task 1: [Name]** (est. 30min)
- What: [Specific implementation detail]
- Files: [file1.js, file2.js]  
- Test: [How will you verify this works?]
- Blocked by: [nothing / Task N]

**Task 2: [Name]** (est. 45min)
- What: [Specific implementation detail]
- Files: [file3.js]
- Test: [Test description]
- Blocked by: Task 1

### Risk Assessment
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

### STOP — Awaiting Approval
Do not proceed to BUILD until this plan is approved.
```

---

## Phase 3: BUILD — /build

### Auto-activates → `[ROLE: Senior Developer]`

Implement one task at a time. Commit after each task.

### Build Rules

1. **One task per commit** — atomic, descriptive commit messages
2. **Write the test FIRST** (TDD — red-green-refactor)
3. **No dead code** — if it's not tested, it's not shipped
4. **No TODOs in committed code** — resolve or create a tracked issue
5. **Read before writing** — understand the surrounding code before changing it
6. **Limit the blast radius** — modify ONLY the files explicitly listed in the current task's plan. Do NOT rewrite adjacent components, hooks, or utilities unless strictly required AND approved. If you spot a problem in nearby code, file it as a separate task, do not fix it inline.

### Commit Message Format

```
type(scope): short description (max 72 chars)

- Detail 1
- Detail 2

Refs: #issue-number
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

---

## Phase 4: VERIFY — /test

### Auto-activates → `[ROLE: QA Lead]`

Tests are proof, not an afterthought.

### Test Strategy by Code Type

**Utilities, services, API routes → TDD (Red-Green-Refactor)**

```
1. RED:      Write a failing test for the next small behavior
2. GREEN:    Write the minimum code to make it pass
3. REFACTOR: Clean up without breaking tests
4. REPEAT
```

**UI Components → BDD (Behavior-Driven Development)**

For complex React components, prioritize testing _user behavior_ over internal state:

- Use **React Testing Library** (`userEvent`, `screen.getByRole`) — test what the user sees
- Use **Playwright** for critical user flows (login, checkout, form submit)
- Do NOT test implementation details (internal state, private methods, component structure)
- Focus on: "When user clicks X, does Y appear?" not "Does `useState` hold the right value?"

```tsx
// ✅ BDD: Test behavior
test("shows error when email is invalid", async () => {
  render(<LoginForm />)
  await userEvent.type(screen.getByLabelText("Email"), "not-an-email")
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }))
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
})

// ❌ Brittle: Testing internal implementation
test("sets error state to true", () => {
  const { result } = renderHook(() => useLoginForm())
  act(() => result.current.setError(true))
  expect(result.current.error).toBe(true)
})
```

### Test Hierarchy (Most to Least Valuable)

```
For logic/services:  Unit Tests → Integration Tests
For UI/flows:        RTL (component) → Playwright (e2e critical paths)
Skip:                Snapshot tests (brittle, low signal)
```

### Test Quality Gates

Before moving to Review, verify:

- [ ] All new code has tests
- [ ] Tests are meaningful (not just coverage theater)
- [ ] Edge cases are covered (null, empty, overflow, unauthorized)
- [ ] Tests fail when the implementation is broken (anti-regression)
- [ ] Test names are readable: `it("returns 404 when user not found")`

---

## Phase 5: REVIEW — /review

### Auto-activates → `[ROLE: Staff Engineer]` + `[ROLE: Senior Designer]` for UI tasks

Review before merging. Always.

### Code Review Checklist

**Correctness**

- [ ] Does it do what the spec says?
- [ ] Are all acceptance criteria met?
- [ ] Edge cases handled?

**Code Quality**

- [ ] Single Responsibility: each function does one thing
- [ ] DRY: no logic duplicated across 3+ places
- [ ] No magic numbers (use named constants)
- [ ] Error handling: all async operations have try/catch or `.catch()`
- [ ] Business logic is NOT in API route handlers — it lives in services/use-cases

**Security**

- [ ] No secrets hardcoded
- [ ] User input is validated and sanitized
- [ ] SQL uses parameterized queries (no string concatenation)
- [ ] Auth checks before data access

**Performance**

- [ ] No N+1 query patterns
- [ ] Expensive operations are cached or async
- [ ] Large data sets are paginated

**UI/Design** (if applicable — activate `impeccable-design` skill checklist)

- [ ] Passes impeccable-design Quick Audit (typography, colors, spacing, animations)
- [ ] Empty states are designed for all lists/tables
- [ ] No hardcoded z-indexes

---

## Phase 6: SHIP — /ship

### Auto-activates → `[ROLE: Release Engineer]`

Only ship when all gates are green.

### Pre-Ship Checklist

- [ ] All tests pass in CI
- [ ] No lint errors
- [ ] Feature works in staging environment
- [ ] Docs updated (README, API docs, changelogs)
- [ ] Breaking changes documented
- [ ] Rollback plan exists
- [ ] Vercel Preview Deployment is successful and manually verified
- [ ] Core Web Vitals pass in the preview environment (LCP < 2.5s, CLS < 0.1, INP < 200ms)

---

## Anti-Patterns to Never Do

| Anti-Pattern | Why It's Wrong | What To Do Instead |
| --- | --- | --- |
| "I'll just write the code and we'll see" | Creates unmaintainable scope creep | Write spec first |
| Writing code in Phase 1 (DEFINE) | Premature implementation | Stay in spec mode |
| Skipping tests because "it's obvious" | Bugs hide in "obvious" code | Write the test anyway |
| Giant commits | Impossible to review or revert | Atomic commits per task |
| Fixing bugs while implementing features | Context switching, hidden changes | Separate branches/commits |
| "I'll add tests later" | Later never comes | TDD: tests first |
| Refactoring adjacent code mid-task | Expands blast radius silently | Separate task/PR for refactors |
| Snapshot tests as primary UI test | Brittle, tests implementation not behavior | Use RTL + Playwright instead |
