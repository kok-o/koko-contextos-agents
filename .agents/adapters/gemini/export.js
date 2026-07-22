const fs = require('fs');
const path = require('path');
const { collectSkillDirectories, resetDirectory } = require('../shared.js');

const GENERATED_SKILLS_PATH = path.join(__dirname, '..', '..', 'generated', 'gemini', 'skills');

function extractYamlField(yamlText, field) {
  const regex = new RegExp(`^${field}:\\s*(.+)$`, 'm');
  const match = yamlText.match(regex);
  return match ? match[1].trim() : null;
}

function generateGeminiSkill(skillDir) {
  const skillName = path.basename(skillDir);
  const yamlPath = path.join(skillDir, 'skill.yaml');
  const existingSkillMdPath = path.join(skillDir, 'SKILL.md');
  const outputDir = path.join(GENERATED_SKILLS_PATH, skillName);
  
  if (!fs.existsSync(yamlPath)) {
    if (fs.existsSync(existingSkillMdPath)) {
      fs.mkdirSync(outputDir, { recursive: true });
      
      let finalContent = fs.readFileSync(existingSkillMdPath, 'utf8');
      
      const examplesPath = path.join(skillDir, 'EXAMPLES.md');
      if (fs.existsSync(examplesPath)) {
        finalContent += '\n\n' + fs.readFileSync(examplesPath, 'utf8');
      }
      
      const troubleshootingPath = path.join(skillDir, 'TROUBLESHOOTING.md');
      if (fs.existsSync(troubleshootingPath)) {
        finalContent += '\n\n' + fs.readFileSync(troubleshootingPath, 'utf8');
      }
      
      fs.writeFileSync(path.join(outputDir, 'SKILL.md'), finalContent);
      
      // Copy remaining files (like VALIDATION.json, scripts/)
      const files = fs.readdirSync(skillDir);
      for (const file of files) {
        if (file !== 'SKILL.md' && file !== 'EXAMPLES.md' && file !== 'TROUBLESHOOTING.md') {
          const srcPath = path.join(skillDir, file);
          const destPath = path.join(outputDir, file);
          if (fs.statSync(srcPath).isFile()) {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      }
      console.log(`Bundled and copied SKILL.md for ${skillName}`);
      return;
    }
    console.log(`Skipping ${skillName} (no skill.yaml or SKILL.md)`);
    return;
  }

  const yamlText = fs.readFileSync(yamlPath, 'utf8');
  const name = extractYamlField(yamlText, 'name') || skillName;
  let description = extractYamlField(yamlText, 'description');
  if (!description) {
    const descRegex = new RegExp(`^description:\\s*>\\s*\\n\\s*([^\\n]+)`, 'm');
    const descMatch = yamlText.match(descRegex);
    if (descMatch) description = descMatch[1].trim();
  }
  description = description || `ContextOS skill for ${name}`;

  // Find all .md files in the skill directory to merge
  const files = fs.readdirSync(skillDir);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  
  let mergedContent = '';
  for (const mdFile of mdFiles) {
    mergedContent += `\n\n<!-- Source: ${mdFile} -->\n\n`;
    mergedContent += fs.readFileSync(path.join(skillDir, mdFile), 'utf8');
  }

  // Construct Gemini SKILL.md format
  const outputContent = `---
name: ${name}
description: >
  ${description}
---
${mergedContent}
`;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'SKILL.md'), outputContent);
  console.log(`Generated SKILL.md for ${skillName}`);
}

function run() {
  console.log('Starting Gemini adapter export...');
  resetDirectory(GENERATED_SKILLS_PATH);
  
  const skills = collectSkillDirectories();
  for (const skill of skills) {
    generateGeminiSkill(skill);
  }
  console.log('Export complete. Skills are in generated/gemini/skills');
}

module.exports = { run };
