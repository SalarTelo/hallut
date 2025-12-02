/**
 * Deletion Module
 * Handles deletion of modules and NPCs
 */

import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import { MODULES_DIR, getExistingModules, fileExists } from './utils.js';

export async function deleteModuleOrNPC(): Promise<void> {
  console.log(chalk.bold.blue('\n┌─────────────────────────────────┐'));
  console.log(chalk.bold.blue('│      Delete Module/NPC         │'));
  console.log(chalk.bold.blue('└─────────────────────────────────┘\n'));

  const modules = await getExistingModules();
  if (modules.length === 0) {
    console.log(chalk.red('❌ No modules found.\n'));
    return;
  }

  const { moduleId } = await prompts({
    type: 'select',
    name: 'moduleId',
    message: 'Select module',
    choices: modules.map(m => ({ title: m, value: m })),
  });

  if (!moduleId) return;

  const { deleteType } = await prompts({
    type: 'select',
    name: 'deleteType',
    message: 'Delete entire module or just an NPC?',
    choices: [
      { title: 'Delete entire module', value: 'module' },
      { title: 'Delete an NPC', value: 'npc' },
    ],
  });

  if (!deleteType) return;

  if (deleteType === 'module') {
    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: chalk.red(`Are you sure you want to delete module "${moduleId}"? This cannot be undone.`),
      initial: false,
    });

    if (!confirm) {
      console.log(chalk.gray('\nCancelled.\n'));
      return;
    }

    const spinner = ora('Deleting module...').start();
    try {
      await fs.rm(path.join(MODULES_DIR, moduleId), { recursive: true, force: true });
      spinner.succeed(chalk.green(`Module "${moduleId}" deleted successfully!\n`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}\n`));
    }
  } else {
    // Delete NPC
    const modulePath = path.join(MODULES_DIR, moduleId);
    const npcPath = path.join(modulePath, 'content/NPC');

    if (!(await fileExists(npcPath))) {
      console.log(chalk.red(`\n❌ No NPCs found in module "${moduleId}".\n`));
      return;
    }

    const npcDirs = (await fs.readdir(npcPath, { withFileTypes: true }))
      .filter(e => e.isDirectory())
      .map(e => e.name);

    if (npcDirs.length === 0) {
      console.log(chalk.red(`\n❌ No NPCs found in module "${moduleId}".\n`));
      return;
    }

    const { npcId } = await prompts({
      type: 'select',
      name: 'npcId',
      message: 'Select NPC to delete',
      choices: npcDirs.map(n => ({ title: n, value: n })),
    });

    if (!npcId) return;

    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: chalk.red(`Delete NPC "${npcId}" from module "${moduleId}"?`),
      initial: false,
    });

    if (!confirm) {
      console.log(chalk.gray('\nCancelled.\n'));
      return;
    }

    const spinner = ora('Deleting NPC...').start();
    try {
      // Delete NPC folder
      await fs.rm(path.join(npcPath, npcId), { recursive: true, force: true });

      // Update NPCs.ts
      const npcsPath = path.join(modulePath, 'content/NPCs.ts');
      if (await fileExists(npcsPath)) {
        let npcsContent = await fs.readFile(npcsPath, 'utf-8');
        const npcVarName = `${npcId}NPC`;
        
        // Remove import
        npcsContent = npcsContent.replace(new RegExp(`import\\s*{\\s*${npcVarName}\\s*}\\s*from\\s*['"].*${npcId}.*['"];?\\s*`, 'g'), '');
        
        // Remove from array
        npcsContent = npcsContent.replace(new RegExp(`,\\s*${npcVarName}|${npcVarName}\\s*,?`, 'g'), '');
        npcsContent = npcsContent.replace(/export const NPCs = \[\s*\]/, 'export const NPCs = []');

        await fs.writeFile(npcsPath, npcsContent, 'utf-8');
      }

      spinner.succeed(chalk.green(`NPC "${npcId}" deleted successfully!\n`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}\n`));
    }
  }
}

