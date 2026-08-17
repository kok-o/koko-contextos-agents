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

describe('Live Multi-Model Benchmark Suite', () => {
  const { resolveProviderConfig } = require('../benchmarks/lib/llm-client');
  const { BENCHMARK_TASKS, loadSkillContext } = require('../benchmarks/lib/tasks');
  const { extractCodeBlocks, runStaticChecks, evaluateSubmission } = require('../benchmarks/lib/evaluator');
  const { generateMarkdownReport, generateHtmlReport } = require('../benchmarks/lib/reporter');

  test('resolves provider configuration accurately from flags and models', () => {
    const openai = resolveProviderConfig({ model: 'gpt-4o' });
    assert.equal(openai.provider, 'openai');
    assert.equal(openai.model, 'gpt-4o');

    const gemini = resolveProviderConfig({ model: 'gemini-2.5-flash' });
    assert.equal(gemini.provider, 'gemini');

    const anthropic = resolveProviderConfig({ model: 'claude-3-7-sonnet-20250219' });
    assert.equal(anthropic.provider, 'anthropic');
  });

  test('extracts code blocks from markdown fences', () => {
    const md = 'Here is the solution:\n```typescript\nconst a: number = 1;\n```\nDone!';
    const code = extractCodeBlocks(md);
    assert.equal(code, 'const a: number = 1;');
  });

  test('runs deterministic static checks for security task', () => {
    const authTask = BENCHMARK_TASKS.find(t => t.id === 'auth-security-hardened');
    assert.ok(authTask);

    const goodCode = `
      import crypto from 'node:crypto';
      function verify(a, b) {
        return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
      }
      const limiter = new RateLimiter();
      jwt.sign(payload, secret, { expiresIn: '15m' });
    `;
    const badCode = `
      function verify(a, b) {
        if (a === b) return true;
        res.status(500).json({ error: err.stack });
      }
    `;

    const goodResult = runStaticChecks(authTask, goodCode);
    const badResult = runStaticChecks(authTask, badCode);

    assert.ok(goodResult.score > badResult.score);
    assert.ok(goodResult.checks.find(c => c.id === 'timing-safe-equal').passed);
    assert.equal(badResult.checks.find(c => c.id === 'timing-safe-equal').passed, false);
  });

  test('loads skill context correctly from filesystem', () => {
    const context = loadSkillContext('security');
    assert.ok(context.includes('Skill Rules: security'));
  });

  test('generates HTML and Markdown reports without errors', () => {
    const mockReport = {
      timestamp: new Date().toISOString(),
      provider: 'openai',
      model: 'gpt-4o',
      summary: {
        tasksCount: 1,
        baselineAvgScore: 60,
        skillAvgScore: 92,
        scoreDelta: 32,
        baselinePassRate: 0,
        skillPassRate: 100,
        passRateDelta: 100,
        baselineStaticAvg: 50,
        skillStaticAvg: 100,
      },
      results: [
        {
          taskId: 'auth-security-hardened',
          title: 'Secure Auth',
          category: 'Security',
          skills: ['security'],
          delta: 32,
          baseline: {
            compositeScore: 60,
            staticScore: 50,
            judgeScore: 70,
            isPassing: false,
            code: 'function login() {}',
            staticChecks: [{ id: 'timing-safe-equal', name: 'Timing safe', passed: false }],
            strengths: [],
            weaknesses: ['Missing timing safe'],
          },
          withSkills: {
            compositeScore: 92,
            staticScore: 100,
            judgeScore: 84,
            isPassing: true,
            code: 'crypto.timingSafeEqual()',
            staticChecks: [{ id: 'timing-safe-equal', name: 'Timing safe', passed: true }],
            strengths: ['Timing safe implemented'],
            weaknesses: [],
          },
        },
      ],
    };

    const md = generateMarkdownReport(mockReport);
    assert.ok(md.includes('ContextOS Skills Benchmark Report'));
    assert.ok(md.includes('+32'));

    const html = generateHtmlReport(mockReport);
    assert.ok(html.includes('ContextOS Benchmark Dashboard'));
    assert.ok(html.includes('gpt-4o'));
  });
});
