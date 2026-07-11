# ContextOS — AI Project Operating System

You are working inside a project managed by **ContextOS**, a context compiler for AI-driven development.

## Core Principle

> **Do not read everything. Read only what the current task requires.**

ContextOS organizes knowledge into a dependency graph. Before starting any task:

1. **Read the Project Graph** (`docs/PROJECT_GRAPH.md`) to understand the project structure
2. **Identify the current task's scope** — which module, feature, and layer it affects
3. **Load only the relevant skills** — the Context Manager will tell you which ones
4. **Check Decision Records** (`docs/decisions/`) for prior architectural choices
5. **Follow the pipeline**: Idea → Requirements → Architecture → Planning → Development → Review → Release

## Pipeline

Every change follows this lifecycle:

```
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

- **DEFINE**: Read PRD, understand requirements
- **PLAN**: Check Architecture, plan minimal changes
- **BUILD**: Write code, follow loaded skills
- **VERIFY**: Test, check edge cases
- **REVIEW**: Self-review against quality gates
- **SHIP**: Commit, document decisions

## Context Loading Rules

### For Frontend tasks
Load: `UI.md`, `ARCHITECTURE.md`, `API.md` + frontend skills (react, typescript, etc.)
Skip: `DATABASE.md`, `DEPLOYMENT.md`

### For Backend tasks
Load: `ARCHITECTURE.md`, `DATABASE.md`, `API.md` + backend skills
Skip: `UI.md`, frontend skills

### For Architecture tasks
Load: `ARCHITECTURE.md`, `DATABASE.md`, `API.md`, `PRD.md` + architecture skills
Skip: `UI.md`, frontend/backend implementation skills

### For Full-Stack tasks
Load: `ARCHITECTURE.md`, `API.md` + check Project Graph for affected modules

## Decision Records

When making architectural decisions (choosing a database, framework, library, pattern):
1. Document it in `docs/decisions/NNNN-decision-name.md`
2. Include: Decision, Why, Alternatives, Tradeoffs, Impact
3. Future tasks must respect existing decisions

## Skills

Skills are located in `.agents/skills/`. Each skill is a directory with:
- `skill.yaml` — machine-readable manifest (dependencies, tags, conflicts)
- `*.md` — human-readable knowledge and instructions

The Context Compiler reads `skill.yaml` to resolve dependencies automatically.
**Never load all skills at once. Load only what the task requires.**
