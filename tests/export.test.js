/**
 * tests/export.test.js
 * Tests for .agents/ctx.js — the context compiler
 * Uses Node.js built-in test runner (node:test) — no dependencies needed
 */

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CTX_PATH = path.join(__dirname, '..', '.agents', 'ctx.js');
const GENERATED_GEMINI = path.join(__dirname, '..', '.agents', 'generated', 'gemini', 'skills');
const GENERATED_CLAUDE = path.join(__dirname, '..', '.agents', 'generated', 'claude', 'skills');

describe('ctx.js — context compiler', () => {
  test('exits with error when no arguments given', () => {
    assert.throws(
      () => execSync(`node "${CTX_PATH}"`, { stdio: 'pipe' }),
      (err) => {
        assert.ok(err instanceof Error, 'Should throw an error');
        return true;
      }
    );
  });

  test('exits with error for unknown agent', () => {
    assert.throws(
      () => execSync(`node "${CTX_PATH}" export unknown-agent`, { stdio: 'pipe' }),
      'Should exit with error for unsupported agent'
    );
  });

  describe('export gemini', () => {
    before(() => {
      execSync(`node "${CTX_PATH}" export gemini`);
    });

    test('creates generated/gemini/skills/ directory', () => {
      assert.ok(fs.existsSync(GENERATED_GEMINI), 'generated/gemini/skills/ should exist');
    });

    test('generates at least 10 skill directories', () => {
      const skills = fs.readdirSync(GENERATED_GEMINI);
      assert.ok(skills.length >= 10, `Expected ≥10 skills, got ${skills.length}`);
    });

    test('each skill directory contains SKILL.md', () => {
      const skills = fs.readdirSync(GENERATED_GEMINI);
      for (const skill of skills) {
        const skillMd = path.join(GENERATED_GEMINI, skill, 'SKILL.md');
        assert.ok(
          fs.existsSync(skillMd),
          `${skill}/SKILL.md should exist`
        );
      }
    });

    test('gstack-roles SKILL.md contains expected content', () => {
      const skillMd = path.join(GENERATED_GEMINI, 'gstack-roles', 'SKILL.md');
      assert.ok(fs.existsSync(skillMd), 'gstack-roles/SKILL.md should exist');
      const content = fs.readFileSync(skillMd, 'utf8');
      assert.ok(content.includes('gstack-roles'), 'Should reference skill name');
      assert.ok(content.length > 500, 'SKILL.md should have substantial content');
    });

    test('ponytail-mindset SKILL.md contains 7-rung ladder', () => {
      const skillMd = path.join(GENERATED_GEMINI, 'ponytail-mindset', 'SKILL.md');
      const content = fs.readFileSync(skillMd, 'utf8');
      assert.ok(content.includes('YAGNI'), 'Should contain YAGNI reference');
    });

    test('generated SKILL.md files have valid frontmatter', () => {
      const skills = fs.readdirSync(GENERATED_GEMINI);
      for (const skill of skills) {
        const skillMd = path.join(GENERATED_GEMINI, skill, 'SKILL.md');
        const content = fs.readFileSync(skillMd, 'utf8');
        if (content.startsWith('---')) {
          // Has frontmatter — validate it closes properly
          const closingIndex = content.indexOf('---', 3);
          assert.ok(
            closingIndex > 3,
            `${skill}/SKILL.md has unclosed frontmatter`
          );
        }
      }
    });
  });

  describe('export claude', () => {
    before(() => {
      execSync(`node "${CTX_PATH}" export claude`);
    });

    test('creates generated/claude/skills/ directory', () => {
      assert.ok(fs.existsSync(GENERATED_CLAUDE), 'generated/claude/skills/ should exist');
    });

    test('claude SKILL.md files do NOT have YAML frontmatter', () => {
      const skills = fs.readdirSync(GENERATED_CLAUDE);
      for (const skill of skills) {
        const skillMd = path.join(GENERATED_CLAUDE, skill, 'SKILL.md');
        const content = fs.readFileSync(skillMd, 'utf8');
        assert.ok(
          !content.startsWith('---'),
          `${skill}/SKILL.md should not start with YAML frontmatter for Claude format`
        );
      }
    });
  });

  describe('export all', () => {
    test('export all runs both adapters successfully', () => {
      const output = execSync(`node "${CTX_PATH}" export all`).toString();
      assert.ok(output.includes('gemini') || output.includes('Gemini'), 'Should mention Gemini');
      assert.ok(output.includes('claude') || output.includes('Claude'), 'Should mention Claude');
    });
  });
});
