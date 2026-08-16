'use strict';

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..');
const CORE_SKILLS_PATH = path.join(AGENTS_DIR, 'core', 'skills');
const AGENTS_MD_PATH = path.join(AGENTS_DIR, 'AGENTS.md');

/**
 * Return every skill available to an installed ContextOS instance.
 * Plugins intentionally live outside `core/skills`, so adapters must use this
 * helper rather than enumerate the core directory themselves.
 */
function collectSkillDirectories(overrideProfile = null) {
  const plugins = require(path.join(AGENTS_DIR, 'plugins.js'));
  let dirs = plugins.collectAllSkillDirs()
    .filter(dir => fs.existsSync(dir) && fs.statSync(dir).isDirectory())
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));

  let profile = overrideProfile;
  if (!profile) {
    try {
      const profilesEngine = require(path.join(AGENTS_DIR, 'profiles.js'));
      profile = profilesEngine.getActiveProfile();
    } catch {
      profile = null;
    }
  }

  if (profile && Array.isArray(profile.exclude_skills) && profile.exclude_skills.length > 0) {
    dirs = dirs.filter(dir => {
      const skillName = path.basename(dir);
      return !profile.exclude_skills.includes(skillName);
    });
  }

  return dirs;
}

function resetDirectory(directory) {
  fs.rmSync(directory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  fs.mkdirSync(directory, { recursive: true });
}

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\r?\n/, '').trimStart();
}

function extractYamlField(yamlText, field) {
  const regex = new RegExp(`^${field}:\\s*(.+)$`, 'm');
  const match = yamlText.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Reads a markdown file only if it exists and contains meaningful content
 * (filters out generic placeholder stubs).
 */
function readMeaningfulMarkdown(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8').trim();
  if (!content) return null;
  if (
    content.length < 150 &&
    (
      content.includes('Add detailed code examples') ||
      content.includes('Add common errors, anti-patterns')
    )
  ) {
    return null;
  }
  return content;
}

module.exports = {
  AGENTS_DIR,
  AGENTS_MD_PATH,
  CORE_SKILLS_PATH,
  collectSkillDirectories,
  extractYamlField,
  readMeaningfulMarkdown,
  resetDirectory,
  stripFrontmatter,
};

