#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

// ── CLI argument parsing ──────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flags = {
  help:        args.includes('--help') || args.includes('-h'),
  ver:         args.includes('--version') || args.includes('-v'),
  dryRun:      args.includes('--dry-run'),
  force:       args.includes('--force'),
  skipCompile: args.includes('--skip-compile'),
  addSkill:    (() => {
    const i = args.indexOf('--add-skill');
    return i !== -1 ? args[i + 1] : null;
  })(),
};

// ── Help / Version ────────────────────────────────────────────────────────────
if (flags.ver) {
  console.log(`koko-contextos-agents v${version}`);
  process.exit(0);
}

if (flags.help) {
  console.log(`
koko-contextos-agents v${version}
Install AI assistant skills and rules into your project.

Usage:
  npx koko-contextos-agents [options]

Options:
  --help, -h          Show this help message
  --version, -v       Show version number
  --dry-run           Preview what will be copied without making changes
  --force             Overwrite existing .agents/ without confirmation warning
  --skip-compile      Skip running ctx.js export after installation
  --add-skill <ref>   Install a community plugin skill after setup

Plugin ref formats:
  username/repo                    GitHub repo with a SKILL.md at the root
  username/repo/path/to/skill      GitHub skill in a subdirectory
  npm-package-name                 A skill published as an npm package

Examples:
  npx koko-contextos-agents                          Install .agents/ into current project
  npx koko-contextos-agents --dry-run                Preview files that would be copied
  npx koko-contextos-agents --force                  Force overwrite existing .agents/
  npx koko-contextos-agents --add-skill alice/my-skill

Export skills to your AI tool:
  node .agents/ctx.js export gemini    → .agents/generated/gemini/   (Gemini / Antigravity)
  node .agents/ctx.js export claude    → .agents/generated/claude/   (Claude Code)
  node .agents/ctx.js export cursor    → .cursorrules                 (Cursor IDE)
  node .agents/ctx.js export copilot   → .github/copilot-instructions.md
  node .agents/ctx.js export aider     → .aider.conf.yml + CONVENTIONS.md
  node .agents/ctx.js export all       → all of the above

Plugin commands (after installation):
  node .agents/ctx.js skill add   <ref>    Install a plugin skill
  node .agents/ctx.js skill remove <name>  Remove a plugin skill
  node .agents/ctx.js skill list           List all skills
  node .agents/ctx.js skill search [query] Search community registry
`);
  process.exit(0);
}

// ── Paths ─────────────────────────────────────────────────────────────────────
const sourcePath = path.join(__dirname, '..', '.agents');
const targetPath = path.join(process.cwd(), '.agents');

// ── Dry run ───────────────────────────────────────────────────────────────────
if (flags.dryRun) {
  console.log('[DRY-RUN] No files will be written.\n');
  if (!fs.existsSync(sourcePath)) {
    console.error('[ERROR] Source .agents/ folder not found in package.');
    process.exit(1);
  }
  const countFiles = (dir) => {
    let count = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      count += entry.isDirectory() ? countFiles(path.join(dir, entry.name)) : 1;
    }
    return count;
  };
  const total = countFiles(sourcePath);
  if (fs.existsSync(targetPath)) {
    console.log(`[WARN] .agents/ already exists — would be updated (--force mode).`);
  } else {
    console.log(`[OK] Would create .agents/ in: ${process.cwd()}`);
  }
  console.log(`[INFO] ${total} files would be copied from the package.`);
  console.log('\nRun without --dry-run to apply changes.');
  process.exit(0);
}

// ── Main install ──────────────────────────────────────────────────────────────
console.log('Installing AI assistant skills (.agents/)...');

try {
  if (!fs.existsSync(sourcePath)) {
    console.error('[ERROR] Source .agents/ folder not found in package.');
    process.exit(1);
  }

  if (fs.existsSync(targetPath) && !flags.force) {
    console.log('[WARN] .agents/ already exists. Files will be updated.');
    console.log('       Use --force to suppress this warning.');
  }

  fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });

  console.log('[OK] .agents/ successfully installed in your project!');
  console.log('[OK] Your AI assistant now has skills and rules configured.\n');

  // ── Auto-compile skills ───────────────────────────────────────────────────
  if (!flags.skipCompile) {
    const ctxPath = path.join(targetPath, 'ctx.js');
    if (fs.existsSync(ctxPath)) {
      console.log('Compiling skills for Gemini...');
      try {
        const { execSync } = require('child_process');
        execSync(`node "${ctxPath}" export gemini`, {
          cwd: process.cwd(),
          stdio: 'inherit',
        });
      } catch (e) {
        console.warn('[WARN] Skill compilation failed — run manually:');
        console.warn('       node .agents/ctx.js export gemini');
      }
    }
  } else {
    console.log('Tip: Run `node .agents/ctx.js export gemini` to compile skills.');
  }

  console.log('\n Next steps:');
  console.log('  1. Open your project in your AI assistant');
  console.log('  2. The assistant will automatically load .agents/AGENTS.md');
  console.log('  3. Skills are pre-compiled in .agents/generated/gemini/skills/');
  console.log('  4. Export to other tools:');
  console.log('       node .agents/ctx.js export cursor   → .cursorrules');
  console.log('       node .agents/ctx.js export copilot  → .github/copilot-instructions.md');
  console.log('       node .agents/ctx.js export aider    → .aider.conf.yml + CONVENTIONS.md');
  console.log('  5. Add community skills (plugins):');
  console.log('       node .agents/ctx.js skill add   username/my-skill');
  console.log('       node .agents/ctx.js skill search');
  console.log('       node .agents/ctx.js skill list');
  console.log('  6. See README for full ctx.js CLI reference\n');

  // ── --add-skill flag ────────────────────────────────────────────────────────
  if (flags.addSkill) {
    const ctxPath = path.join(targetPath, 'ctx.js');
    if (fs.existsSync(ctxPath)) {
      console.log(`Installing plugin skill: ${flags.addSkill}`);
      try {
        const { execSync } = require('child_process');
        execSync(`node "${ctxPath}" skill add "${flags.addSkill}"`, {
          cwd: process.cwd(),
          stdio: 'inherit',
        });
      } catch (e) {
        console.warn(`[WARN] Skill install failed — run manually:`);
        console.warn(`       node .agents/ctx.js skill add ${flags.addSkill}`);
      }
    }
  }

} catch (error) {
  console.error('[ERROR] Installation failed:', error.message);
  process.exit(1);
}
