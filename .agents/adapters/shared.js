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
function collectSkillDirectories() {
  const plugins = require(path.join(AGENTS_DIR, 'plugins.js'));
  return plugins.collectAllSkillDirs()
    .filter(dir => fs.existsSync(dir) && fs.statSync(dir).isDirectory())
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
}

function resetDirectory(directory) {
  fs.rmSync(directory, { recursive: true, force: true });
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

module.exports = {
  AGENTS_DIR,
  AGENTS_MD_PATH,
  CORE_SKILLS_PATH,
  collectSkillDirectories,
  extractYamlField,
  resetDirectory,
  stripFrontmatter,
};
