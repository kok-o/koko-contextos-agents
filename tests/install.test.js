/**
 * tests/install.test.js
 * Tests for bin/index.js — the main installer
 * Uses Node.js built-in test runner (node:test) — no dependencies needed
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const BIN_PATH = path.join(__dirname, '..', 'bin', 'index.js');
const AGENTS_SOURCE = path.join(__dirname, '..', '.agents');

describe('bin/index.js — installer', () => {
  let tmpDir;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'koko-test-'));
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('--version flag prints version', () => {
    const output = execSync(`node "${BIN_PATH}" --version`).toString().trim();
    assert.match(output, /\d+\.\d+\.\d+/, 'Should print a semver version');
  });

  test('--help flag prints usage', () => {
    const output = execSync(`node "${BIN_PATH}" --help`).toString();
    assert.ok(output.includes('Usage:'), 'Should include Usage section');
    assert.ok(output.includes('--dry-run'), 'Should list --dry-run flag');
    assert.ok(output.includes('--force'), 'Should list --force flag');
  });

  test('--dry-run does not create .agents/ folder', () => {
    const targetAgents = path.join(tmpDir, 'dry-run-test', '.agents');
    const testDir = path.join(tmpDir, 'dry-run-test');
    fs.mkdirSync(testDir, { recursive: true });

    execSync(`node "${BIN_PATH}" --dry-run --skip-compile`, { cwd: testDir });

    assert.ok(!fs.existsSync(targetAgents), '.agents/ should NOT be created in dry-run mode');
  });

  test('installs .agents/ folder with required files', () => {
    const testDir = path.join(tmpDir, 'install-test');
    fs.mkdirSync(testDir, { recursive: true });

    execSync(`node "${BIN_PATH}" --skip-compile`, { cwd: testDir });

    const agentsDir = path.join(testDir, '.agents');
    assert.ok(fs.existsSync(agentsDir), '.agents/ should be created');
    assert.ok(fs.existsSync(path.join(agentsDir, 'AGENTS.md')), 'AGENTS.md should exist');
    assert.ok(fs.existsSync(path.join(agentsDir, 'skills.json')), 'skills.json should exist');
    assert.ok(fs.existsSync(path.join(agentsDir, 'ctx.js')), 'ctx.js should exist');
  });

  test('--force flag installs without warning output', () => {
    const testDir = path.join(tmpDir, 'force-test');
    fs.mkdirSync(path.join(testDir, '.agents'), { recursive: true });

    // Should not throw even though .agents/ exists
    const output = execSync(`node "${BIN_PATH}" --force --skip-compile`, {
      cwd: testDir,
    }).toString();

    assert.ok(!output.includes('Warning:'), '--force should suppress the warning');
  });
});
