const process = require('process');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node ctx.js export <agent>');
  console.log('');
  console.log('Commands:');
  console.log('  export gemini    Compile skills for Gemini / Antigravity');
  console.log('  export claude    Compile skills for Claude Code');
  console.log('  export all       Compile skills for all supported agents');
  console.log('');
  console.log('Supported agents: gemini, claude, all');
  process.exit(1);
}

const command = args[0];
const target = args[1];

if (command === 'export') {
  const runGemini = () => {
    const geminiAdapter = require('./adapters/gemini/export.js');
    geminiAdapter.run();
  };

  const runClaude = () => {
    const claudeAdapter = require('./adapters/claude/export.js');
    claudeAdapter.run();
  };

  if (target === 'gemini') {
    runGemini();
  } else if (target === 'claude') {
    runClaude();
  } else if (target === 'all') {
    console.log('Exporting skills for all agents...\n');
    runGemini();
    console.log('');
    runClaude();
    console.log('\nAll exports complete.');
  } else {
    console.error(`Adapter for '${target}' not implemented yet.`);
    console.error('Supported agents: gemini, claude, all');
    process.exit(1);
  }
} else {
  console.error(`Unknown command: ${command}`);
  console.error('Usage: node ctx.js export <agent>');
  process.exit(1);
}
