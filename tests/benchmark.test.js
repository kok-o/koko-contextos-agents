'use strict';

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { buildAgentPrompt, parseAgentReply, parseArgs, scoreRun, summarize, safeRelativePath } = require('../benchmarks/gemini-issues.js');

describe('Gemini issue benchmark', () => {
  test('parses a controller-compatible agent reply', () => {
    const reply = parseAgentReply('{"read":["src/app.js"],"patch":"","ready":false,"summary":"Need context"}');
    assert.deepEqual(reply.read, ['src/app.js']);
    assert.equal(reply.ready, false);
  });

  test('rejects a patch that is not a git diff', () => {
    assert.throws(() => parseAgentReply('{"read":[],"patch":"console.log(1)","ready":false}'));
  });

  test('keeps requested files inside the repository', () => {
    const repository = path.resolve('fixtures/repository');
    assert.equal(safeRelativePath(repository, '../secret.txt'), null);
    assert.equal(safeRelativePath(repository, 'src/index.js'), path.join(repository, 'src', 'index.js'));
  });

  test('requires an explicit command-execution flag', () => {
    const options = parseArgs([]);
    assert.equal(options.allowCommands, false);
    assert.equal(options.count, 20);
  });

  test('scores a narrowly scoped, tested fix', () => {
    const score = scoreRun({
      ready: true,
      test: { passed: true },
      filesChanged: ['src/fix.js'],
      judge: { score: 25 },
      iterations: 2,
    });
    assert.equal(score.total, 103);
  });

  test('creates paired aggregate statistics', () => {
    const task = { id: 'owner/repo#1' };
    const summary = summarize([
      { task, mode: 'without_skills', status: 'ready', test: { passed: true }, iterations: 3, score: { total: 70 } },
      { task, mode: 'with_skills', status: 'ready', test: { passed: true }, iterations: 2, score: { total: 90 } },
    ]);
    assert.equal(summary.pairedTasks, 1);
    assert.equal(summary.meanSkillScoreDelta, 20);
  });

  test('with-skills prompt includes skill guidance while baseline does not', () => {
    const task = { title: 'Fix bug', body: 'Details', issueUrl: 'https://example.test/issues/1' };
    const withSkills = buildAgentPrompt(task, 'with_skills', {});
    const baseline = buildAgentPrompt(task, 'without_skills', {});
    assert.ok(withSkills.includes('ContextOS skills are authoritative guidance'));
    assert.ok(!baseline.includes('ContextOS skills are authoritative guidance'));
  });
});
