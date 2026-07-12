const process = require('process');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  printHelp();
  process.exit(1);
}

function printHelp() {
  console.log('Usage: node ctx.js <command> [args...]');
  console.log('');
  console.log('Commands:');
  console.log('  export gemini    Compile skills for Gemini / Antigravity');
  console.log('  export claude    Compile skills for Claude Code');
  console.log('  export cursor    Compile skills → .cursorrules');
  console.log('  export copilot   Compile skills → .github/copilot-instructions.md');
  console.log('  export aider     Compile skills → .aider.conf.yml + CONVENTIONS.md');
  console.log('  export all       Compile skills for all supported agents');
  console.log('  validate         Validate skill sources, frontmatter, deps & sync');
  console.log('  skill add   <ref>    Install a plugin skill (GitHub or npm)');
  console.log('  skill remove <name>  Uninstall a plugin skill');
  console.log('  skill list           List installed skills (builtin + plugins)');
  console.log('  skill search [query] Search the community skill registry');
  console.log('');
  console.log('Plugin ref formats:');
  console.log('  username/repo                    GitHub repo root SKILL.md');
  console.log('  username/repo@commit             GitHub repo pinned to a commit');
  console.log('  username/repo/path/to/skill      GitHub subpath skill');
  console.log('  npm-package-name                 npm package');
  console.log('  @scope/npm-package               scoped npm package');
  console.log('');
  console.log('Examples:');
  console.log('  node .agents/ctx.js skill add alice/my-cool-skill');
  console.log('  node .agents/ctx.js skill add alice/monorepo/skills/docker');
  console.log('  node .agents/ctx.js skill search react');
  console.log('  node .agents/ctx.js skill list');
}

const command = args[0];
const target  = args[1];

// ── export ────────────────────────────────────────────────────────────────────
if (command === 'export') {
  const runGemini = () => {
    const adapter = require('./adapters/gemini/export.js');
    adapter.run();
  };

  const runClaude = () => {
    const adapter = require('./adapters/claude/export.js');
    adapter.run();
  };

  const runCursor = () => {
    const adapter = require('./adapters/cursor/export.js');
    adapter.run();
  };

  const runCopilot = () => {
    const adapter = require('./adapters/copilot/export.js');
    adapter.run();
  };

  const runAider = () => {
    const adapter = require('./adapters/aider/export.js');
    adapter.run();
  };

  if (target === 'gemini') {
    runGemini();
  } else if (target === 'claude') {
    runClaude();
  } else if (target === 'cursor') {
    runCursor();
  } else if (target === 'copilot') {
    runCopilot();
  } else if (target === 'aider') {
    runAider();
  } else if (target === 'all') {
    console.log('Exporting skills for all agents...\n');
    runGemini();
    console.log('');
    runClaude();
    console.log('');
    runCursor();
    console.log('');
    runCopilot();
    console.log('');
    runAider();
    console.log('\nAll exports complete.');
  } else {
    console.error(`Adapter for '${target}' not implemented yet.`);
    console.error('Supported agents: gemini, claude, cursor, copilot, aider, all');
    process.exit(1);
  }

// ── validate ──────────────────────────────────────────────────────────────────
} else if (command === 'validate') {
  const validator = require('./validate.js');
  validator.run();

// ── skill ─────────────────────────────────────────────────────────────────────
} else if (command === 'skill') {
  const subcommand = args[1];
  const ref        = args[2];
  const dryRun     = args.includes('--dry-run');
  const plugins    = require('./plugins.js');

  if (!subcommand || subcommand === 'help') {
    printHelp();
    process.exit(0);
  }

  if (subcommand === 'add') {
    plugins.add(ref, { dryRun }).catch(err => {
      console.error(`[ERROR] ${err.message}`);
      process.exit(1);
    });
  } else if (subcommand === 'remove') {
    plugins.remove(ref); // ref is the skill name here
  } else if (subcommand === 'list') {
    plugins.list();
  } else if (subcommand === 'search') {
    const query = args.slice(2).join(' ');
    plugins.search(query).catch(err => {
      console.error(`[ERROR] ${err.message}`);
      process.exit(1);
    });
  } else {
    console.error(`Unknown skill subcommand: ${subcommand}`);
    console.error('Valid subcommands: add, remove, list, search');
    process.exit(1);
  }

// ── unknown ───────────────────────────────────────────────────────────────────
} else {
  console.error(`Unknown command: ${command}`);
  console.error('Run: node ctx.js (no args) to see help');
  process.exit(1);
}
