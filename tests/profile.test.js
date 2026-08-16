/**
 * tests/profile.test.js
 * Tests for .agents/profiles.js — Profile system and stack detection
 * Uses Node.js built-in test runner (node:test) — zero extra dependencies
 */

'use strict';

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const profiles = require('../.agents/profiles.js');
const { collectSkillDirectories } = require('../.agents/adapters/shared.js');

describe('profiles.js — profile management & detection', () => {
  let tmpDir;

  before(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'contextos-profile-test-'));
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    profiles.removeActiveProfile();
  });

  test('listProfiles returns available profiles', () => {
    const list = profiles.listProfiles();
    assert.ok(list.length >= 4, `Expected at least 4 profiles, got ${list.length}`);
    const ids = list.map(p => p.id);
    assert.ok(ids.includes('mvp'), 'Should include mvp profile');
    assert.ok(ids.includes('startup'), 'Should include startup profile');
    assert.ok(ids.includes('enterprise'), 'Should include enterprise profile');
    assert.ok(ids.includes('frontend'), 'Should include frontend profile');
    assert.ok(ids.includes('backend'), 'Should include backend profile');
  });

  test('getProfile returns expected profile structure', () => {
    const mvp = profiles.getProfile('mvp');
    assert.ok(mvp, 'MVP profile should exist');
    assert.equal(mvp.id, 'mvp');
    assert.ok(Array.isArray(mvp.exclude_skills), 'MVP should have exclude_skills array');
    assert.ok(mvp.exclude_skills.includes('microservices'), 'MVP should exclude microservices');
    assert.ok(mvp.exclude_skills.includes('ddd'), 'MVP should exclude ddd');
  });

  test('detectStack identifies React/Next.js and suggests frontend profile', () => {
    const projectDir = path.join(tmpDir, 'next-project');
    fs.mkdirSync(projectDir, { recursive: true });
    fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify({
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.0.0',
        'tailwindcss': '^3.0.0'
      }
    }));

    const result = profiles.detectStack(projectDir);
    assert.ok(result.detected.includes('Next.js'));
    assert.ok(result.detected.includes('Tailwind CSS'));
    assert.equal(result.recommendedProfile, 'frontend');
    assert.ok(result.recommendedSkills.includes('nextjs'));
    assert.ok(result.recommendedSkills.includes('react'));
  });

  test('detectStack identifies Python stack', () => {
    const projectDir = path.join(tmpDir, 'py-project');
    fs.mkdirSync(projectDir, { recursive: true });
    fs.writeFileSync(path.join(projectDir, 'requirements.txt'), 'fastapi\nuvicorn\n');

    const result = profiles.detectStack(projectDir);
    assert.ok(result.detected.includes('Python'));
    assert.equal(result.recommendedProfile, 'backend');
    assert.ok(result.recommendedSkills.includes('fastapi'));
  });

  test('applyProfile and removeActiveProfile manage .agents/profile.json lock', () => {
    const targetProject = path.join(tmpDir, 'lock-project');
    fs.mkdirSync(targetProject, { recursive: true });

    const applied = profiles.applyProfile('mvp', targetProject);
    assert.equal(applied.profile, 'mvp');
    assert.ok(applied.exclude_skills.includes('microservices'));

    const active = profiles.getActiveProfile(targetProject);
    assert.ok(active, 'Active profile should exist');
    assert.equal(active.profile, 'mvp');

    const removed = profiles.removeActiveProfile(targetProject);
    assert.equal(removed, true);
    assert.equal(profiles.getActiveProfile(targetProject), null);
  });

  test('collectSkillDirectories filters skills based on active profile exclusion', () => {
    const allSkills = collectSkillDirectories();
    const mvpProfile = profiles.getProfile('mvp');
    const mvpSkills = collectSkillDirectories(mvpProfile);

    assert.ok(mvpSkills.length < allSkills.length, 'MVP skills should be fewer than all skills');
    const mvpNames = mvpSkills.map(s => path.basename(s));
    assert.ok(!mvpNames.includes('microservices'), 'microservices should be excluded under MVP');
    assert.ok(!mvpNames.includes('ddd'), 'ddd should be excluded under MVP');
    assert.ok(mvpNames.includes('ponytail-mindset'), 'ponytail-mindset should be included');
  });
});
