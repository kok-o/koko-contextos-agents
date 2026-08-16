# <img src="./Frame%202.png" height="40" align="absmiddle" /> koko-contextos-agents

[![npm version](https://img.shields.io/npm/v/koko-contextos-agents.svg)](https://www.npmjs.com/package/koko-contextos-agents)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.7.0-brightgreen.svg)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](#testing)

This is an open-source set of skills and behavioral rules for AI assistants. The package automatically installs an `.agents` folder into your project, teaching your AI assistant software development best practices (UI Design, Architecture, Security, and more).

## Installation

You do not need to clone anything manually. Just open your terminal in the root of your project and run:

```bash
npx koko-contextos-agents
```

The script will automatically detect your project tech stack, create the `.agents` folder, configure skills, and compile them for your AI agent.

### Options

```bash
npx koko-contextos-agents --help          # Show all options
npx koko-contextos-agents --version       # Show version
npx koko-contextos-agents --profile mvp   # Install with specific profile (mvp, startup, enterprise, frontend, backend)
npx koko-contextos-agents --auto          # Auto-detect tech stack and apply recommended profile
npx koko-contextos-agents --dry-run       # Preview what will be installed
npx koko-contextos-agents --force         # Overwrite an existing .agents/ folder
npx koko-contextos-agents --skip-compile  # Skip auto-compilation step
```

## Why Use This? (Benefits)

- **Save Tokens & Context:** ContextOS dynamically loads only the required skills (e.g., loads UI skills for frontend tasks, skips backend rules). This prevents context window bloat and saves token costs.
- **Superior Code Quality:** Pre-configured skills force the AI to use modern design patterns (DDD, microservices) and professional UI standards (no pure black colors, semantic palettes) rather than generic internet code.
- **Save Time:** Stop writing massive system prompts or arguing with the AI. The assistant instantly knows your architectural decisions and coding standards from the start.

## Project Profiles & Stack Auto-Detection

ContextOS allows you to tailor your AI rules to the project lifecycle and architecture:

| Profile | Focus | Excluded / Filtered Skills | Ideal For |
|---|---|---|---|
| `mvp` | Maximum speed & minimalism | `microservices`, `ddd`, `cqrs`, `kubernetes` | Hackathons, prototypes, fast validation |
| `startup` | Balanced agile stack | `microservices`, `kubernetes` | SaaS startups, modular monoliths |
| `enterprise` | Maximum rigor & compliance | _(none)_ — full TDD, DDD, Security Audit | Large scale teams, strict audit requirements |
| `frontend` | Dedicated UI/UX & React | `fastapi`, `nestjs`, `microservices`, `ddd` | Next.js, React, Design systems, SPAs |
| `backend` | Server-side & APIs | `ui-ux-pro`, `impeccable-design`, `ui-design` | API servers, microservices, databases |

### Profile Commands

```bash
# Auto-detect tech stack in the current project
node .agents/ctx.js detect

# List available profiles and current active profile
node .agents/ctx.js profile list

# Apply a profile
node .agents/ctx.js profile apply mvp

# Recompile all agent exports for the active profile
node .agents/ctx.js export all
```

## What's Inside?

### Master Orchestrator

- **AGENTS.md** — The core ruleset. Automatically routes skills by task type and technology detected in your codebase.

### Skills (24 total)

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

The `.agents/ctx.js` file is the **Context Compiler** — a local CLI tool that reads skills from `core/skills/` and generates agent-ready rules for specific AI platforms.

### Supported Agents

| Agent | Command | Output Format |
|-------|---------|---------------|
| **Gemini / Antigravity** | `export gemini` | `.agents/generated/gemini/skills/` |
| **Claude Code** | `export claude` | `.agents/generated/claude/skills/` |
| **Cursor IDE** | `export cursor` | `.cursor/rules/*.mdc` (modular globs) + `.cursorrules` |
| **GitHub Copilot** | `export copilot` | `.github/copilot-instructions.md` |
| **Aider** | `export aider` | `.aider.conf.yml` + `CONVENTIONS.md` |
| **Zed IDE** | `export zed` | `.zed/rules.md` + `.zed/prompts/*.md` |

### Available Commands

```bash
node .agents/ctx.js export all       # Compile for all agents
node .agents/ctx.js export gemini    # Compile for Gemini / Antigravity
node .agents/ctx.js export claude    # Compile for Claude Code
node .agents/ctx.js export cursor    # Compile for Cursor (.cursor/rules/*.mdc)
node .agents/ctx.js export copilot   # Compile for GitHub Copilot
node .agents/ctx.js export aider     # Compile for Aider
node .agents/ctx.js export zed       # Compile for Zed IDE
```

### Plugin Skills & Validation

You can expand your `.agents` folder with community plugins or validate your own custom skills using the top-level commands:

```bash
# Launch the interactive skill installer to browse and install community skills
npx koko-contextos-agents install-skill

# Or install a specific skill from a GitHub repository automatically
npx koko-contextos-agents install-skill --from-repo kok-o/awesome-skill

# Validate your local skills (checks frontmatter, dependencies, and sync)
npx koko-contextos-agents audit
```

## Testing

Tests use the **Node.js built-in test runner** — zero extra dependencies.

```bash
npm test
```

```text
# tests 94
# suites 22
# pass  94
# fail  0
```

**Test coverage:**

- `tests/install.test.js` — installer CLI flags (--help, --dry-run, --force)
- `tests/export.test.js` — ctx.js export for gemini, claude, cursor (.mdc rules), copilot, aider
- `tests/skills.test.js` — validates all skill source files and frontmatter
- `tests/profile.test.js` — profile resolution, stack auto-detection, and skill filtering
- `tests/validate.test.js` — validator rules, dependency graph, and sync checks
- `tests/plugins.test.js` — plugin lockfile, registry fetching, and security checks

## Benchmark: With Skills vs. Without Skills

The repository includes a paired, reproducible code-quality benchmark running across **20 real, closed GitHub Issues** with linked merged pull requests:

### Benchmark Summary (Gemini 3 Flash & Issue Suites)

| Benchmark Metric | Without Skills (Baseline) | With ContextOS Skills | Delta / Impact |
|:---|:---:|:---:|:---:|
| **Security & Auth Score (Task 1)** | 80/100 | **96/100** | **+16 pts** |
| **Concurrency & Async Queue (Task 5)** | 75/100 | **95/100** | **+20 pts** |
| **Overall Production Quality** | 80.0% Pass | **88.2 / 100** | **Strict Invariants Enforced** |
| **Token Bloat Reduction** | Baseline (100%) | **~46% of baseline** | **-54% tokens saved** |
| **Turns to Resolution (20 GitHub Issues)** | 5.1 turns | **3.2 turns** | **-37% fewer turns** |

### Running the Benchmark

```bash
# Run live paired engineering benchmark on Gemini 3 Flash:
set GEMINI_API_KEY=...     # PowerShell: $env:GEMINI_API_KEY = "..."
node benchmarks/run-live-benchmark.js

# Or run full GitHub issues paired benchmark:
set GITHUB_TOKEN=...       # PowerShell: $env:GITHUB_TOKEN = "..."
node benchmarks/gemini-issues.js --allow-commands
```

Use `--dry-run` to discover and validate tasks without calling Gemini:

```bash
node benchmarks/gemini-issues.js --dry-run
```

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
