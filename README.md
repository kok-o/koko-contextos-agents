# <img src="./Frame%202.png" height="40" align="absmiddle" /> koko-contextos-agents

[![npm version](https://img.shields.io/npm/v/koko-contextos-agents.svg)](https://www.npmjs.com/package/koko-contextos-agents)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.7.0-brightgreen.svg)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-19%20passing-brightgreen.svg)](#testing)

This is an open-source set of skills and behavioral rules for AI assistants. The package automatically installs an `.agents` folder into your project, teaching your AI assistant software development best practices (UI Design, Architecture, Security, and more).

## Installation

You do not need to clone anything manually. Just open your terminal in the root of your project and run:

```bash
npx koko-contextos-agents
```

The script will automatically create the `.agents` folder, copy all skills, and compile them for your AI agent.

### Options

```bash
npx koko-contextos-agents --help        # Show all options
npx koko-contextos-agents --version     # Show version
npx koko-contextos-agents --dry-run     # Preview what will be installed
npx koko-contextos-agents --force       # Overwrite an existing .agents/ folder
npx koko-contextos-agents --skip-compile  # Skip auto-compilation step
```

## Why Use This? (Benefits)

- **Save Tokens & Context:** ContextOS dynamically loads only the required skills (e.g., loads UI skills for frontend tasks, skips backend rules). This prevents context window bloat and saves token costs.
- **Superior Code Quality:** Pre-configured skills force the AI to use modern design patterns (DDD, microservices) and professional UI standards (no pure black colors, semantic palettes) rather than generic internet code.
- **Save Time:** Stop writing massive system prompts or arguing with the AI. The assistant instantly knows your architectural decisions and coding standards from the start.

## What's Inside?

### Master Orchestrator

- **AGENTS.md** — The core ruleset. Automatically routes skills by task type and technology detected in your codebase.

### Skills (25 total)

| Category | Skill | What It Does |
| ---------- | ------- | ------------- |
| Core | `gstack-roles` | 23 specialist roles (PM, Architect, QA Lead, etc.) — AI declares its role before each task |
| Core | `engineering-workflow` | Enforces DEFINE→PLAN→BUILD→VERIFY→REVIEW→SHIP pipeline. No code before spec is approved. |
| Core | `ponytail-mindset` | 7-rung decision ladder before writing any code. Reduces code output ~54%. |
| Frontend | `ui-ux-pro` | Planning guide for UI: color systems, typography, Framer Motion, shadcn/ui patterns |
| Frontend | `impeccable-design` | 50 deterministic QA rules for design review (typography, color, layout, animation) |
| Frontend | `react` | React component patterns |
| Frontend | `nextjs` | Next.js App Router, Server Actions, routing |
| Frontend | `typescript` | Type-safe code, generics, config |
| Frontend | `ui-design` | Component library design, design tokens |
| Frontend | `ux-design` | User flow design, interaction patterns |
| Frontend | `web-accessibility` | ARIA, WCAG compliance |
| Backend | `system-design` | Pre-design checklist, Serverless/Edge patterns, BFF/Server Actions, DDD isolation |
| Backend | `node` | Node.js server patterns |
| Backend | `fastapi` | FastAPI / Python backend |
| Backend | `nestjs` | NestJS framework |
| Backend | `microservices` | Service decomposition, bounded contexts |
| Backend | `ddd` | Domain-Driven Design, domain modeling |
| Cross | `security` | Auth patterns, input validation, SQL injection prevention |
| Cross | `performance` | Core Web Vitals, optimization strategies |
| Cross | `decisions` | Architectural decision records format |
| Cross | `adapters` | System integration patterns |
| Cross | `generators` | Code generation patterns |
| Cross | `context-manager` | Context loading optimization |
| Cross | `context-os` | ContextOS meta-skill |

## CLI — Context Compiler (`ctx.js`)

The `.agents/ctx.js` file is the **Context Compiler** — a local CLI tool that reads skills from `core/skills/` and generates agent-ready `SKILL.md` files for specific AI platforms.

### How it works

```
.agents/core/skills/<skill>/      ← source (SKILL.md)
           ↓
  node .agents/ctx.js export gemini
           ↓
.agents/generated/gemini/skills/<skill>/SKILL.md  ← compiled output
```

### Available Commands

```bash
node .agents/ctx.js export gemini    # Compile for Gemini / Antigravity
node .agents/ctx.js export claude    # Compile for Claude Code
node .agents/ctx.js export all       # Compile for all agents
```

**Supported agents:**

| Agent | Command | Output |
|-------|---------|--------|
| Gemini / Antigravity | `export gemini` | `.agents/generated/gemini/skills/` |
| Claude Code | `export claude` | `.agents/generated/claude/skills/` |

**Run after editing skills:**

```bash
npm run build   # alias for: node .agents/ctx.js export all
```

`generated/` is compiled output used by Gemini and Claude. Keep it in the
published package; edit the source skills under `core/skills/`, then regenerate
the output with the command above. `adapters/` contains the generators and must
also remain in the package.

## Testing

Tests use the **Node.js built-in test runner** — zero extra dependencies.

```bash
npm test
```

```
# tests 19
# pass  19
# fail  0
```

**Test coverage:**

- `tests/install.test.js` — installer CLI flags (--help, --dry-run, --force)
- `tests/export.test.js` — ctx.js export for gemini, claude, and all
- `tests/skills.test.js` — validates all 25 skill source files

## Contributing

We are open to pull requests! See [CONTRIBUTING.md](./CONTRIBUTING.md) for a step-by-step guide on how to add a new skill.

Quick start:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingSkill`)
3. Add your skill in `.agents/core/skills/<name>/SKILL.md`
4. Run `npm test` — all tests must pass
5. Commit your changes (`git commit -m 'feat: add AmazingSkill'`)
6. Push and open a Pull Request

## License

Distributed under the MIT License. You can freely use, modify, and distribute this code.
