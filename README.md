# <img src="./Frame%202.png" height="40" align="absmiddle" /> koko-contextos-agents

This is an open-source set of skills and behavioral rules for AI assistants. The package automatically installs an `.agents` folder into your project, teaching your AI assistant software development best practices (UI Design, Architecture, Security, and more).

## Installation

You do not need to clone anything manually. Just open your terminal in the root of your project and run:

```bash
npx koko-contextos-agents
```

The script will automatically create the `.agents` folder and copy all necessary instructions.

## Why Use This? (Benefits)
- **Save Tokens & Context:** ContextOS dynamically loads only the required skills (e.g., loads UI skills for frontend tasks, skips backend rules). This prevents context window bloat and saves token costs.
- **Superior Code Quality:** Pre-configured skills force the AI to use modern design patterns (DDD, microservices) and professional UI standards (no pure black colors, semantic palettes) rather than generic internet code.
- **Save Time:** Stop writing massive system prompts or arguing with the AI. The assistant instantly knows your architectural decisions and coding standards from the start.

## What's Inside?
- **Project Rules (AGENTS.md):** Base instructions that the AI must unconditionally follow.
- **Skills:** Ready-to-use prompts and guidelines for specific technologies (React, Next.js, FastAPI, Node.js).
- **Design Patterns:** Architectural rules, DDD, microservices.

## CLI — Context Compiler (`ctx.js`)

The `.agents/ctx.js` file is the **Context Compiler** — a local CLI tool that reads skills from `core/skills/` and generates agent-ready `SKILL.md` files for specific AI platforms.

### How it works

```
.agents/core/skills/<skill>/      ← source (skill.yaml + SKILL.md)
           ↓
  node .agents/ctx.js export gemini
           ↓
.agents/generated/gemini/skills/<skill>/SKILL.md  ← compiled output
```

The compiler merges `skill.yaml` metadata with the `SKILL.md` content and outputs a file in the format each AI agent expects.

### Available Commands

#### `export` — Compile skills for an AI agent

```bash
node .agents/ctx.js export gemini
```

Reads all skills from `.agents/core/skills/`, compiles them, and writes the output to `.agents/generated/gemini/skills/`.

**Run this command whenever you:**
- Add a new skill to `core/skills/`
- Edit an existing skill
- Want to refresh the generated output

**Supported agents:**

| Agent | Command | Output directory |
|-------|---------|-----------------|
| Gemini / Antigravity | `node .agents/ctx.js export gemini` | `.agents/generated/gemini/skills/` |
| *(more coming)* | — | — |

### When to Run

| Situation | Command |
|-----------|---------|
| After adding a new skill | `node .agents/ctx.js export gemini` |
| After editing an existing skill | `node .agents/ctx.js export gemini` |
| After cloning the repo | `node .agents/ctx.js export gemini` |
| First-time setup | `node .agents/ctx.js export gemini` |

### Expected Output

```
Starting Gemini adapter export...
Generated SKILL.md for gstack-roles
Generated SKILL.md for ui-ux-pro
Generated SKILL.md for system-design
Generated SKILL.md for engineering-workflow
Generated SKILL.md for impeccable-design
Generated SKILL.md for ponytail-mindset
... (25 skills total)
Export complete. Skills are in generated/gemini/skills
```

## Testing

*(Tests will be added here soon)*

## Contributing
We are open to pull requests! If you want to add a new AI skill or improve existing ones:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingSkill`)
3. Commit your changes (`git commit -m 'Add some AmazingSkill'`)
4. Push to the branch (`git push origin feature/AmazingSkill`)
5. Open a Pull Request

## License
Distributed under the MIT License. You can freely use, modify, and distribute this code.
