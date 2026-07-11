const fs = require('fs');
const path = require('path');

const CORE_SKILLS_PATH = path.join(__dirname, '..', '..', 'core', 'skills');
const GENERATED_SKILLS_PATH = path.join(__dirname, '..', '..', 'generated', 'claude', 'skills');

/**
 * Claude Code skill format:
 * - Plain Markdown, no YAML frontmatter required
 * - First line is the skill name as an H1 comment
 * - Content is preserved as-is (Claude reads raw Markdown well)
 */
function generateClaudeSkill(skillDir) {
  const skillName = path.basename(skillDir);
  const existingSkillMdPath = path.join(skillDir, 'SKILL.md');
  const outputDir = path.join(GENERATED_SKILLS_PATH, skillName);

  if (!fs.existsSync(existingSkillMdPath)) {
    console.log(`Skipping ${skillName} (no SKILL.md)`);
    return;
  }

  let content = fs.readFileSync(existingSkillMdPath, 'utf8');

  // Strip YAML frontmatter if present (Claude doesn't need it)
  content = content.replace(/^---[\s\S]*?---\n/, '');

  // Write the cleaned Markdown
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'SKILL.md'), content.trimStart());
  console.log(`Generated SKILL.md for ${skillName} (claude)`);
}

function run() {
  console.log('Starting Claude adapter export...');
  fs.mkdirSync(GENERATED_SKILLS_PATH, { recursive: true });

  const skills = fs.readdirSync(CORE_SKILLS_PATH);
  for (const skill of skills) {
    const fullPath = path.join(CORE_SKILLS_PATH, skill);
    if (fs.statSync(fullPath).isDirectory()) {
      generateClaudeSkill(fullPath);
    }
  }
  console.log('Export complete. Skills are in generated/claude/skills');
}

module.exports = { run };
