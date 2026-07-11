# koko-contextos-agents

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
