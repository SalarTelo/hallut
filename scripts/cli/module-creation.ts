/**
 * Module Creation Wizard
 * Handles creating new modules with full configuration
 */

import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { MODULES_DIR, validateModuleId, toDisplayName, getExistingModules, fileExists, ensureDirectory } from './utils.js';
import { buildUnlockRequirement } from './unlock-requirements.js';
import {
  getIndexTemplate,
  getConfigTemplate,
  getContentIndexTemplate,
  getTasksTemplateQuick,
  getTasksTemplateDetailed,
  getObjectsTemplateQuick,
  getObjectsTemplateDetailed,
  getNPCsTemplate,
  getNPCIndexTemplate,
  getNPCDialoguesTemplate,
  getNPCStateTemplate,
} from './templates.js';

export async function createModule(): Promise<void> {
  console.log(chalk.bold.blue('\n┌─────────────────────────────────┐'));
  console.log(chalk.bold.blue('│      Create New Module         │'));
  console.log(chalk.bold.blue('└─────────────────────────────────┘\n'));

  // Mode selection
  const { mode } = await prompts({
    type: 'select',
    name: 'mode',
    message: 'Creation mode',
    choices: [
      { title: 'Quick start (minimal prompts)', value: 'quick' },
      { title: 'Detailed (full wizard)', value: 'detailed' },
    ],
  });

  if (!mode) return;

  const isDetailed = mode === 'detailed';

  // Module information
  const responses = await prompts([
    {
      type: 'text',
      name: 'moduleId',
      message: 'Module ID',
      validate: validateModuleId,
      format: (val) => val.trim().toLowerCase(),
    },
    {
      type: 'text',
      name: 'displayName',
      message: 'Display Name',
      initial: (prev) => toDisplayName(prev),
    },
    ...(isDetailed ? [
      {
        type: 'text',
        name: 'description',
        message: 'Description',
        initial: (prev, values) => `A ${values.displayName?.toLowerCase() || 'new'} module`,
      },
      {
        type: 'text',
        name: 'version',
        message: 'Version',
        initial: '1.0.0',
        validate: (v) => /^\d+\.\d+\.\d+$/.test(v) || 'Version must be in semver format (e.g. 1.0.0)',
      },
    ] : []),
    {
      type: 'text',
      name: 'bgColor',
      message: 'Background Color (hex)',
      initial: '#1a1a2e',
      validate: (c) => /^#[0-9A-Fa-f]{6}$/.test(c) || 'Color must be a valid hex color (e.g. #1a1a2e)',
    },
  ]);

  if (Object.keys(responses).length === 0) return;

  const { moduleId, displayName, description = `A ${displayName.toLowerCase()} module`, version = '1.0.0', bgColor } = responses;

  // Check if module already exists
  const modulePath = path.join(MODULES_DIR, moduleId);
  if (await fileExists(modulePath)) {
    console.log(chalk.red(`\n❌ Module "${moduleId}" already exists at ${modulePath}\n`));
    return;
  }

  // Unlock requirements
  const modules = await getExistingModules();
  const unlockRequirement = await buildUnlockRequirement(modules, moduleId);

  // Worldmap configuration
  const { setWorldmap } = await prompts({
    type: 'confirm',
    name: 'setWorldmap',
    message: 'Set worldmap position?',
    initial: false,
  });

  let worldmapConfig = '';
  if (setWorldmap) {
    const worldmap = await prompts([
      {
        type: 'number',
        name: 'x',
        message: 'X position (0-100)',
        initial: 50,
        validate: (v) => v >= 0 && v <= 100 || 'Must be between 0 and 100',
      },
      {
        type: 'number',
        name: 'y',
        message: 'Y position (0-100)',
        initial: 50,
        validate: (v) => v >= 0 && v <= 100 || 'Must be between 0 and 100',
      },
      {
        type: 'select',
        name: 'shape',
        message: 'Icon shape',
        choices: [
          { title: 'Circle', value: 'circle' },
          { title: 'Square', value: 'square' },
          { title: 'Diamond', value: 'diamond' },
        ],
        initial: 0,
      },
      {
        type: 'number',
        name: 'size',
        message: 'Icon size',
        initial: 48,
        validate: (v) => v > 0 || 'Size must be positive',
      },
    ]);
    if (worldmap.x !== undefined && worldmap.y !== undefined) {
      worldmapConfig = `worldmap: {\n      position: { x: ${worldmap.x}, y: ${worldmap.y} },\n      icon: {\n        shape: '${worldmap.shape || 'circle'}',\n        size: ${worldmap.size || 48},\n      },\n    }`;
    }
  }

  // Example creation
  const examples = await prompts([
    {
      type: 'confirm',
      name: 'createTask',
      message: 'Create example task?',
      initial: isDetailed,
    },
    {
      type: 'confirm',
      name: 'createNPC',
      message: 'Create example NPC?',
      initial: isDetailed,
    },
    {
      type: 'confirm',
      name: 'createObject',
      message: 'Create example object?',
      initial: isDetailed,
    },
  ]);

  // Generate files
  const spinner = ora('Creating module structure...').start();

  try {
    // Create directories
    await ensureDirectory(modulePath);
    await ensureDirectory(path.join(modulePath, 'content'));
    if (examples.createNPC) {
      await ensureDirectory(path.join(modulePath, 'content/NPC'));
    }

    // Create main files
    await fs.writeFile(
      path.join(modulePath, 'index.ts'),
      getIndexTemplate(moduleId, displayName),
      'utf-8'
    );

    await fs.writeFile(
      path.join(modulePath, 'config.ts'),
      getConfigTemplate(moduleId, displayName, description, version, bgColor, unlockRequirement || '', worldmapConfig),
      'utf-8'
    );

    // Create content files
    await fs.writeFile(
      path.join(modulePath, 'content/index.ts'),
      getContentIndexTemplate(),
      'utf-8'
    );

    // If creating example NPC, ensure we have exampleTask in tasks.ts
    // (NPC will import it, so it needs to exist)
    const shouldIncludeExampleTask = examples.createNPC || isDetailed;
    
    await fs.writeFile(
      path.join(modulePath, 'content/tasks.ts'),
      shouldIncludeExampleTask ? getTasksTemplateDetailed() : getTasksTemplateQuick(),
      'utf-8'
    );

    await fs.writeFile(
      path.join(modulePath, 'content/objects.ts'),
      isDetailed ? getObjectsTemplateDetailed() : getObjectsTemplateQuick(),
      'utf-8'
    );

    await fs.writeFile(
      path.join(modulePath, 'content/NPCs.ts'),
      getNPCsTemplate(),
      'utf-8'
    );

    // Create example NPC if requested
    if (examples.createNPC) {
      const npcPath = path.join(modulePath, 'content/NPC/guard');
      await ensureDirectory(npcPath);

      // exampleTask should exist if we're creating example NPC (we ensured it above)
      // Double-check to be safe
      const tasksPath = path.join(modulePath, 'content/tasks.ts');
      let hasExampleTask = shouldIncludeExampleTask;
      if (await fileExists(tasksPath)) {
        const taskContent = await fs.readFile(tasksPath, 'utf-8');
        hasExampleTask = /export\s+(const|function)\s+exampleTask/.test(taskContent);
      }

      await fs.writeFile(
        path.join(npcPath, 'index.ts'),
        getNPCIndexTemplate('guard', 'Guard', { x: 20, y: 30 }, 'shield', hasExampleTask, true),
        'utf-8'
      );

      await fs.writeFile(
        path.join(npcPath, 'dialogues.ts'),
        getNPCDialoguesTemplate('guard', 'Guard', hasExampleTask),
        'utf-8'
      );

      await fs.writeFile(
        path.join(npcPath, 'state.ts'),
        getNPCStateTemplate('guard', 'Guard'),
        'utf-8'
      );

      // Update NPCs.ts to include guard
      const npcsContent = await fs.readFile(path.join(modulePath, 'content/NPCs.ts'), 'utf-8');
      const updatedNPCs = npcsContent
        .replace('// TODO: Import your NPCs here', "import { guardNPC } from './NPC/guard/index.js';")
        .replace('export const NPCs: Array', 'export const NPCs = [guardNPC];\n\nexport const _NPCsArray: Array');
      await fs.writeFile(path.join(modulePath, 'content/NPCs.ts'), updatedNPCs, 'utf-8');
    }

    spinner.succeed(chalk.green(`Module "${moduleId}" created successfully!`));
    console.log(chalk.gray(`   Location: ${modulePath}\n`));
    console.log(chalk.dim('Next steps:'));
    console.log(chalk.dim('   1. Edit config.ts to customize manifest and welcome'));
    console.log(chalk.dim('   2. Edit content/tasks.ts to create your tasks'));
    console.log(chalk.dim('   3. Edit content/NPCs.ts and content/NPC/ to add NPCs'));
    console.log(chalk.dim('   4. Edit content/objects.ts to add objects'));
    console.log(chalk.dim('   5. Run: npm run dev to test your module\n'));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to create module: ${error instanceof Error ? error.message : 'Unknown error'}`));
    throw error;
  }
}

