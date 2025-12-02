/**
 * Debug Tools Module
 * Handles debug tools and module introspection
 */

import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import chalk from 'chalk';
import { MODULES_DIR, getExistingModules, fileExists } from './utils.js';

export async function showDebugTools(): Promise<void> {
  while (true) {
    console.log(chalk.bold.blue('\n┌─────────────────────────────────┐'));
    console.log(chalk.bold.blue('│      Debug Tools               │'));
    console.log(chalk.bold.blue('└─────────────────────────────────┘\n'));

    const { tool } = await prompts({
      type: 'select',
      name: 'tool',
      message: 'Select debug tool',
      choices: [
        { title: '🔍 Module Introspection', value: 'introspect' },
        { title: '✅ Type Check (not implemented yet)', value: 'typecheck' },
        { title: '🌳 Dependency Graph (not implemented yet)', value: 'deps' },
        { title: '🔗 Reference Checker (not implemented yet)', value: 'refs' },
        { title: '🔎 Search References (not implemented yet)', value: 'search' },
        { title: '📦 Export Test (not implemented yet)', value: 'export' },
        { title: '📊 State Inspection (not implemented yet)', value: 'state' },
        { title: '🧪 Dry-Run Mode (not implemented yet)', value: 'dryrun' },
        { title: '← Back to main menu', value: 'back' },
      ],
    });

    if (!tool || tool === 'back') return;

    switch (tool) {
      case 'introspect':
        await moduleIntrospection();
        break;
      case 'typecheck':
        console.log(chalk.yellow('\n⚠️  Type checking not yet implemented\n'));
        break;
      case 'deps':
        console.log(chalk.yellow('\n⚠️  Dependency graph not yet implemented\n'));
        break;
      case 'refs':
        console.log(chalk.yellow('\n⚠️  Reference checker not yet implemented\n'));
        break;
      case 'search':
        console.log(chalk.yellow('\n⚠️  Search references not yet implemented\n'));
        break;
      case 'export':
        console.log(chalk.yellow('\n⚠️  Export test not yet implemented\n'));
        break;
      case 'state':
        console.log(chalk.yellow('\n⚠️  State inspection not yet implemented\n'));
        break;
      case 'dryrun':
        console.log(chalk.yellow('\n⚠️  Dry-run mode not yet implemented\n'));
        break;
    }
  }
}

export async function moduleIntrospection(): Promise<void> {
  console.log(chalk.bold.blue('\n┌─────────────────────────────────┐'));
  console.log(chalk.bold.blue('│   Module Introspection        │'));
  console.log(chalk.bold.blue('└─────────────────────────────────┘\n'));

  const modules = await getExistingModules();
  if (modules.length === 0) {
    console.log(chalk.red('❌ No modules found.\n'));
    return;
  }

  const { moduleId } = await prompts({
    type: 'select',
    name: 'moduleId',
    message: 'Select module to inspect',
    choices: modules.map(m => ({ title: m, value: m })),
  });

  if (!moduleId) return;

  const modulePath = path.join(MODULES_DIR, moduleId);
  console.log(chalk.bold(`\n📦 Module: ${moduleId}\n`));
  console.log(chalk.dim(`Location: ${modulePath}\n`));

  // Read and display structure
  try {
    const indexPath = path.join(modulePath, 'index.ts');
    const configPath = path.join(modulePath, 'config.ts');
    const tasksPath = path.join(modulePath, 'content/tasks.ts');
    const objectsPath = path.join(modulePath, 'content/objects.ts');
    const npcsPath = path.join(modulePath, 'content/NPCs.ts');

    console.log(chalk.bold('Files:'));
    if (await fileExists(indexPath)) {
      console.log(chalk.green('   ✓ index.ts'));
    } else {
      console.log(chalk.red('   ❌ index.ts (missing)'));
    }
    if (await fileExists(configPath)) {
      console.log(chalk.green('   ✓ config.ts'));
    } else {
      console.log(chalk.red('   ❌ config.ts (missing)'));
    }
    if (await fileExists(tasksPath)) {
      const tasksContent = await fs.readFile(tasksPath, 'utf-8');
      const taskMatches = tasksContent.match(/export const \w+Task = createTask/g) || [];
      console.log(chalk.green(`   ✓ content/tasks.ts (${taskMatches.length} task(s))`));
    } else {
      console.log(chalk.yellow('   ⚠️  content/tasks.ts (not found)'));
    }
    if (await fileExists(objectsPath)) {
      const objectsContent = await fs.readFile(objectsPath, 'utf-8');
      const objectMatches = objectsContent.match(/export const \w+Object = create/g) || [];
      console.log(chalk.green(`   ✓ content/objects.ts (${objectMatches.length} object(s))`));
    } else {
      console.log(chalk.yellow('   ⚠️  content/objects.ts (not found)'));
    }
    if (await fileExists(npcsPath)) {
      const npcsContent = await fs.readFile(npcsPath, 'utf-8');
      const npcMatches = npcsContent.match(/import.*NPC.*from/g) || [];
      console.log(chalk.green(`   ✓ content/NPCs.ts (${npcMatches.length} NPC(s))`));
      
      // List NPC folders
      const npcDir = path.join(modulePath, 'content/NPC');
      if (await fileExists(npcDir)) {
        const npcDirs = (await fs.readdir(npcDir, { withFileTypes: true }))
          .filter(e => e.isDirectory())
          .map(e => e.name);
        if (npcDirs.length > 0) {
          console.log(chalk.dim('   NPCs:'));
          for (const npc of npcDirs) {
            console.log(chalk.dim(`      - ${npc}/`));
          }
        }
      }
    } else {
      console.log(chalk.yellow('   ⚠️  content/NPCs.ts (not found)'));
    }

    console.log();
  } catch (error) {
    console.log(chalk.red(`   ❌ Error reading module: ${error instanceof Error ? error.message : 'Unknown error'}`));
  }
}

