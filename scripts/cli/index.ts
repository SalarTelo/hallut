#!/usr/bin/env node

/**
 * Prototyp CLI Wizard
 * Interactive CLI for managing modules, tasks, NPCs, and validation
 * 
 * Usage: npm run cli
 *        npm run cli -- create module
 *        npm run cli -- validate
 */

import prompts from 'prompts';
import chalk from 'chalk';
import { getExistingModules } from './utils.js';
import { createModule } from './module-creation.js';
import { createNPC } from './npc-creation.js';
import { createTask } from './task-creation.js';
import { createObject } from './object-creation.js';
import { validateModulesFlow, validateAllModules, validateSingleModule } from './validation.js';
import { editModule } from './editing.js';
import { deleteModuleOrNPC } from './deletion.js';
import { showDebugTools } from './debug-tools.js';

// ============================================================================
// Main Menu and Navigation
// ============================================================================

async function listModules(): Promise<void> {
  console.log(chalk.bold('\n📚 Available Modules\n'));

  const modules = await getExistingModules();
  if (modules.length === 0) {
    console.log(chalk.gray('   No modules found.\n'));
    return;
  }

  for (const moduleId of modules) {
    console.log(`   ✓ ${moduleId}`);
  }
  console.log();
}

async function showMainMenu(): Promise<void> {
  console.log(chalk.bold.blue('\n┌─────────────────────────────────┐'));
  console.log(chalk.bold.blue('│     Prototyp CLI Wizard       │'));
  console.log(chalk.bold.blue('└─────────────────────────────────┘\n'));

  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      { title: '📦 Create new module', value: 'create-module' },
      { title: '📝 Create new NPC', value: 'create-npc' },
      { title: '🔍 Validate module', value: 'validate' },
      { title: '📚 List modules', value: 'list' },
      { title: '✏️  Edit module (not implemented yet)', value: 'edit' },
      { title: '🗑️  Delete module/NPC', value: 'delete' },
      { title: '🐛 Debug Tools', value: 'debug' },
      { title: '🚪 Exit', value: 'exit' },
    ],
    initial: 0,
  });

  if (!action || action === 'exit') {
    console.log(chalk.gray('\n👋 Goodbye!\n'));
    process.exit(0);
  }

  try {
    switch (action) {
      case 'create-module':
        await createModule();
        break;
      case 'create-npc':
        await createNPC();
        break;
      case 'validate':
        await validateModulesFlow();
        break;
      case 'list':
        await listModules();
        break;
      case 'edit':
        await editModule();
        break;
      case 'delete':
        await deleteModuleOrNPC();
        break;
      case 'debug':
        await showDebugTools();
        break;
    }
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`));
  }

  // Ask to continue
  const { continue: shouldContinue } = await prompts({
    type: 'confirm',
    name: 'continue',
    message: 'Return to main menu?',
    initial: true,
  });

  if (shouldContinue) {
    await showMainMenu();
  } else {
    process.exit(0);
  }
}

// ============================================================================
// CLI Entry Point
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    // Direct command execution (non-interactive)
    if (command === 'create' && args[1] === 'module') {
      await createModule();
      return;
    }

    if (command === 'validate') {
      if (args[1] === '--all' || args[1] === '-a') {
        await validateAllModules();
      } else if (args[1]) {
        await validateSingleModule(args[1]);
      } else {
        await validateModulesFlow();
      }
      return;
    }

    if (command === 'list') {
      await listModules();
      return;
    }

    // Interactive mode
    await showMainMenu();
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`));
    process.exit(1);
  }
}

main();

