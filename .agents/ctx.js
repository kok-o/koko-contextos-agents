const process = require('process');
const path = require('path');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node ctx.js export <agent>');
  console.log('Supported agents: gemini');
  process.exit(1);
}

const command = args[0];
const target = args[1];

if (command === 'export') {
  if (target === 'gemini') {
    const geminiAdapter = require('./adapters/gemini/export.js');
    geminiAdapter.run();
  } else {
    console.error(`Adapter for '${target}' not implemented yet.`);
    process.exit(1);
  }
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
