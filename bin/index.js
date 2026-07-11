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

Examples:
  npx koko-contextos-agents               Install .agents/ into current project
  npx koko-contextos-agents --dry-run     Preview files that would be copied
  npx koko-contextos-agents --force       Force overwrite existing .agents/
`);
  process.exit(0);
}

// ── Paths ─────────────────────────────────────────────────────────────────────
const sourcePath = path.join(__dirname, '..', '.agents');
const targetPath = path.join(process.cwd(), '.agents');

// ── Dry run ───────────────────────────────────────────────────────────────────
if (flags.dryRun) {
  console.log('🔍 Dry run — no files will be written.\n');
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ Source .agents/ folder not found in package.');
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
    console.log(`⚠️  .agents/ already exists — would be updated (--force mode).`);
  } else {
    console.log(`✅ Would create .agents/ in: ${process.cwd()}`);
  }
  console.log(`📦 ${total} files would be copied from the package.`);
  console.log('\nRun without --dry-run to apply changes.');
  process.exit(0);
}

// ── Main install ──────────────────────────────────────────────────────────────
console.log('⏳ Installing AI assistant skills (.agents/)...');

try {
  if (!fs.existsSync(sourcePath)) {
    console.error('❌ Error: Source .agents/ folder not found in package.');
    process.exit(1);
  }

  if (fs.existsSync(targetPath) && !flags.force) {
    console.log('⚠️  Warning: .agents/ already exists. Files will be updated.');
    console.log('   Use --force to suppress this warning.');
  }

  fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });

  console.log('✅ .agents/ successfully installed in your project!');
  console.log('🤖 Your AI assistant now has skills and rules configured.\n');

  // ── Auto-compile skills ───────────────────────────────────────────────────
  if (!flags.skipCompile) {
    const ctxPath = path.join(targetPath, 'ctx.js');
    if (fs.existsSync(ctxPath)) {
      console.log('⚙️  Compiling skills for Gemini...');
      try {
        const { execSync } = require('child_process');
        execSync(`node "${ctxPath}" export gemini`, {
          cwd: process.cwd(),
          stdio: 'inherit',
        });
      } catch (e) {
        console.warn('⚠️  Skill compilation failed — run manually:');
        console.warn('   node .agents/ctx.js export gemini');
      }
    }
  } else {
    console.log('💡 Tip: Run `node .agents/ctx.js export gemini` to compile skills.');
  }

  console.log('\n📚 Next steps:');
  console.log('  1. Open your project in your AI assistant');
  console.log('  2. The assistant will automatically load .agents/AGENTS.md');
  console.log('  3. Skills are pre-compiled in .agents/generated/gemini/skills/');
  console.log('  4. See README for ctx.js CLI commands\n');

} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}
