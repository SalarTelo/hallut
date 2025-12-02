/**
 * NPC Creation Wizard
 * Handles creating new NPCs in modules
 */

import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { MODULES_DIR, getExistingModules, fileExists, ensureDirectory } from './utils.js';
import { getNPCIndexTemplate, getNPCDialoguesTemplate, getNPCStateTemplate } from './templates.js';

export async function createNPC(): Promise<void> {
  console.log(chalk.bold.blue('\n┌─────────────────────────────────┐'));
  console.log(chalk.bold.blue('│      Create New NPC            │'));
  console.log(chalk.bold.blue('└─────────────────────────────────┘\n'));

  const modules = await getExistingModules();
  if (modules.length === 0) {
    console.log(chalk.red('❌ No modules found. Create a module first.\n'));
    return;
  }

  const { createInModule } = await prompts({
    type: 'select',
    name: 'createInModule',
    message: 'Create NPC in existing module or standalone?',
    choices: [
      { title: 'In existing module', value: 'module' },
      { title: 'Standalone (not implemented yet)', value: 'standalone' },
    ],
  });

  if (!createInModule) return;

  let moduleId: string | null = null;
  if (createInModule === 'module') {
    const { selectedModule } = await prompts({
      type: 'select',
      name: 'selectedModule',
      message: 'Select module',
      choices: modules.map(m => ({ title: m, value: m })),
    });
    if (!selectedModule) return;
    moduleId = selectedModule;
  }

  const npcDetails = await prompts([
    {
      type: 'text',
      name: 'npcId',
      message: 'NPC ID',
      validate: (v) => /^[a-z0-9-]+$/.test(v) || 'NPC ID must be lowercase alphanumeric with hyphens',
      format: (val) => val.trim().toLowerCase(),
    },
    {
      type: 'text',
      name: 'npcName',
      message: 'NPC Name',
    },
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
      type: 'text',
      name: 'avatar',
      message: 'Avatar (default: "avatar")',
      initial: 'avatar',
    },
  ]);

  if (Object.keys(npcDetails).length === 0) return;

  const { npcId, npcName, x, y, avatar = 'avatar' } = npcDetails;

  if (!moduleId) {
    console.log(chalk.yellow('\n⚠️  Standalone NPC creation is not implemented yet. Please create within a module.\n'));
    return;
  }

  const modulePath = path.join(MODULES_DIR, moduleId);
  if (!(await fileExists(modulePath))) {
    console.log(chalk.red(`\n❌ Module "${moduleId}" not found.\n`));
    return;
  }

  const spinner = ora('Creating NPC...').start();

  try {
    const npcPath = path.join(modulePath, 'content/NPC', npcId);
    await ensureDirectory(npcPath);

    // Check if tasks exist to link
    const tasksPath = path.join(modulePath, 'content/tasks.ts');
    const hasTasks = await fileExists(tasksPath);
    let taskContent = '';
    if (hasTasks) {
      taskContent = await fs.readFile(tasksPath, 'utf-8');
    }
    // Check if exampleTask is actually exported (not just mentioned in comments)
    const hasExampleTask = hasTasks && /export\s+(const|function)\s+exampleTask/.test(taskContent);

    await fs.writeFile(
      path.join(npcPath, 'index.ts'),
      getNPCIndexTemplate(npcId, npcName, { x, y }, avatar, hasExampleTask, true),
      'utf-8'
    );

    await fs.writeFile(
      path.join(npcPath, 'dialogues.ts'),
      getNPCDialoguesTemplate(npcId, npcName, hasExampleTask),
      'utf-8'
    );

    await fs.writeFile(
      path.join(npcPath, 'state.ts'),
      getNPCStateTemplate(npcId, npcName),
      'utf-8'
    );

    // Update NPCs.ts
    const npcsPath = path.join(modulePath, 'content/NPCs.ts');
    if (await fileExists(npcsPath)) {
      let npcsContent = await fs.readFile(npcsPath, 'utf-8');
      const npcVarName = `${npcId}NPC`;
      const importLine = `import { ${npcVarName} } from './NPC/${npcId}/index.js';`;

      // Add import if not present
      if (!npcsContent.includes(importLine)) {
        // Try to find TODO comment first
        if (npcsContent.includes('// TODO: Import your NPCs here')) {
          npcsContent = npcsContent.replace(
            '// TODO: Import your NPCs here',
            `// TODO: Import your NPCs here\n${importLine}`
          );
        } else {
          // If TODO is gone, add import before the first existing import or before NPCs declaration
          const importMatch = npcsContent.match(/^import\s+.*from\s+/m);
          if (importMatch) {
            const insertPos = importMatch.index! + importMatch[0].length;
            const lineEnd = npcsContent.indexOf('\n', insertPos);
            npcsContent = npcsContent.slice(0, lineEnd) + `\n${importLine}` + npcsContent.slice(lineEnd);
          } else {
            // Add at top of file after comments
            const firstImportOrDecl = npcsContent.search(/(?:^import|^export)/m);
            if (firstImportOrDecl > 0) {
              npcsContent = npcsContent.slice(0, firstImportOrDecl) + `${importLine}\n` + npcsContent.slice(firstImportOrDecl);
            }
          }
        }
      }

      // Update NPCs array
      if (npcsContent.includes('export const NPCs: Array')) {
        // Type-only declaration, convert to actual array
        npcsContent = npcsContent.replace(
          'export const NPCs: Array',
          `export const NPCs = [${npcVarName}];\n\nexport const _NPCsArray: Array`
        );
      } else if (npcsContent.includes('export const NPCs = [')) {
        // Add to existing array
        const arrayMatch = npcsContent.match(/export const NPCs = \[([^\]]*)\]/s);
        if (arrayMatch) {
          const existingContent = arrayMatch[1].trim();
          const isExistingEmpty = !existingContent || existingContent === '';
          const newArrayContent = isExistingEmpty 
            ? npcVarName 
            : `${existingContent},\n  ${npcVarName}`;
          npcsContent = npcsContent.replace(
            /export const NPCs = \[([^\]]*)\]/s,
            `export const NPCs = [${newArrayContent}]`
          );
        }
      }

      await fs.writeFile(npcsPath, npcsContent, 'utf-8');
    }

    spinner.succeed(chalk.green(`NPC "${npcId}" created successfully!`));
    console.log(chalk.gray(`   Location: ${npcPath}\n`));
    console.log(chalk.dim('Next steps:'));
    console.log(chalk.dim(`   1. Edit ${path.join(npcPath, 'dialogues.ts')} to customize dialogue`));
    console.log(chalk.dim(`   2. Edit ${path.join(npcPath, 'state.ts')} to add state properties`));
    console.log(chalk.dim(`   3. Link tasks in ${path.join(npcPath, 'index.ts')}\n`));
  } catch (error) {
    spinner.fail(chalk.red(`Failed to create NPC: ${error instanceof Error ? error.message : 'Unknown error'}`));
    throw error;
  }
}

