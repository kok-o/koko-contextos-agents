# Contributing to koko-contextos-agents

Thank you for contributing! This guide explains how to add skills, run tests, and submit pull requests.

---

## How to Add a New Skill

### Step 1: Create the skill directory

```bash
mkdir .agents/core/skills/<your-skill-name>
```

Skill names should be lowercase, hyphenated (e.g., `vue`, `prisma`, `docker`).

### Step 2: Create `SKILL.md`

```bash
touch .agents/core/skills/<your-skill-name>/SKILL.md
```

**Required structure:**

```markdown
---
name: your-skill-name
description: >
  One or two sentence description of what this skill does
  and when it activates.
---

# Skill Title — Short Tagline

Brief explanation of the source/inspiration.

## Core Principle

> One-sentence guiding principle in a blockquote.

---

## [Main content sections...]
```

**Rules for skill content:**
- Must have valid YAML frontmatter with `name:` and `description:`
- Must have at least one `## Section` heading
- Must be > 100 bytes (not empty)
- Should include concrete examples, not just abstract principles
- Should include an anti-patterns table where applicable

### Step 3: Compile and test

```bash
# Compile skills for all agents
node .agents/ctx.js export all

# Verify the generated output
cat .agents/generated/gemini/skills/<your-skill-name>/SKILL.md
cat .agents/generated/claude/skills/<your-skill-name>/SKILL.md
```

### Step 4: Run tests

```bash
npm test
```

All 19 tests must pass before submitting a PR.

---

## How to Test Locally (npm link)

To test the full installation flow as if a user ran `npx koko-contextos-agents`:

```bash
# In the repo root:
npm link

# In a fresh test project directory:
mkdir /tmp/test-project && cd /tmp/test-project
npm init -y
npx koko-contextos-agents

# Verify:
ls .agents/
cat .agents/AGENTS.md
```

To unlink when done:
```bash
npm unlink koko-contextos-agents
```

---

## CLI Commands Reference

| Command | Description |
|---------|-------------|
| `node .agents/ctx.js export gemini` | Compile skills for Gemini / Antigravity |
| `node .agents/ctx.js export claude` | Compile skills for Claude Code |
| `node .agents/ctx.js export all` | Compile skills for all agents |
| `npm test` | Run full test suite (19 tests) |
| `npm run build` | Alias for `export all` |

---

## skill.yaml Format (Optional)

If your skill has complex metadata, you can add a `skill.yaml` alongside `SKILL.md`:

```yaml
name: your-skill-name
description: >
  Description of the skill.
tags:
  - frontend
  - react
version: "1.0.0"
```

The compiler will merge `skill.yaml` metadata with the `SKILL.md` content when generating output.

---

## Pull Request Checklist

Before opening a PR:

- [ ] New skill directory is in `.agents/core/skills/<name>/`
- [ ] `SKILL.md` has valid YAML frontmatter with `name:` and `description:`
- [ ] `SKILL.md` has substantial content (> 100 bytes)
- [ ] `npm test` passes (all 19 tests green)
- [ ] `node .agents/ctx.js export all` runs without errors
- [ ] Skill is referenced in `AGENTS.md` Skill Registry table (if major)

---

## Project Structure

```
koko-contextos-agents/
├── bin/
│   └── index.js              ← npm installer CLI (npx koko-contextos-agents)
├── .agents/
│   ├── AGENTS.md             ← Master orchestrator (skill routing rules)
│   ├── skills.json           ← Skill registry
│   ├── ctx.js                ← Context compiler CLI
│   ├── core/
│   │   └── skills/           ← SKILL SOURCE FILES (edit these)
│   │       ├── gstack-roles/
│   │       ├── ui-ux-pro/
│   │       └── ...
│   ├── adapters/
│   │   ├── gemini/export.js  ← Gemini adapter
│   │   └── claude/export.js  ← Claude adapter
│   └── generated/            ← COMPILED OUTPUT (do not edit manually)
│       ├── gemini/skills/
│       └── claude/skills/
├── tests/
│   ├── install.test.js
│   ├── export.test.js
│   └── skills.test.js
└── package.json
```

---

## Code of Conduct

Be kind. Be constructive. Focus on improving the quality of skills for the community.
