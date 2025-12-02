/**
 * Validation Module
 * Handles module validation
 */

import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import { MODULES_DIR, getExistingModules, fileExists } from './utils.js';

export async function validateModule(moduleId: string): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const modulePath = path.join(MODULES_DIR, moduleId);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!(await fileExists(modulePath))) {
    return {
      valid: false,
      errors: [`Module "${moduleId}" not found at ${modulePath}`],
      warnings: [],
    };
  }

  // Check required files
  const requiredFiles = [
    'index.ts',
    'config.ts',
    'content/index.ts',
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(modulePath, file);
    if (!(await fileExists(filePath))) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  // Check content files
  const contentFiles = ['content/tasks.ts', 'content/objects.ts', 'content/NPCs.ts'];
  let hasContent = false;
  for (const file of contentFiles) {
    const filePath = path.join(modulePath, file);
    if (await fileExists(filePath)) {
      hasContent = true;
      break;
    }
  }

  if (!hasContent) {
    warnings.push('No content files found (tasks.ts, objects.ts, or NPCs.ts)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export async function validateModulesFlow(): Promise<void> {
  console.log(chalk.bold.blue('\n┌─────────────────────────────────┐'));
  console.log(chalk.bold.blue('│      Validate Module           │'));
  console.log(chalk.bold.blue('└─────────────────────────────────┘\n'));

  const modules = await getExistingModules();
  if (modules.length === 0) {
    console.log(chalk.red('❌ No modules found.\n'));
    return;
  }

  const { moduleId } = await prompts({
    type: 'select',
    name: 'moduleId',
    message: 'Select module to validate',
    choices: [
      ...modules.map(mod => ({ title: mod, value: mod })),
      { title: '🔍 Validate all modules', value: '__all__' },
    ],
  });

  if (!moduleId) return;

  if (moduleId === '__all__') {
    await validateAllModules();
  } else {
    await validateSingleModule(moduleId);
  }
}

export async function validateSingleModule(moduleId: string): Promise<void> {
  const spinner = ora(`Validating module "${moduleId}"...`).start();

  const result = await validateModule(moduleId);

  spinner.stop();

  if (result.valid && result.warnings.length === 0) {
    console.log(chalk.green(`\n✅ Module "${moduleId}" is valid!\n`));
  } else {
    if (result.errors.length > 0) {
      console.log(chalk.red(`\n❌ Module "${moduleId}" has errors:\n`));
      result.errors.forEach(err => console.log(chalk.red(`   ❌ ${err}`)));
      console.log();
    }
    if (result.warnings.length > 0) {
      console.log(chalk.yellow(`⚠️  Warnings:\n`));
      result.warnings.forEach(warn => console.log(chalk.yellow(`   ⚠️  ${warn}`)));
      console.log();
    }
  }
}

export async function validateAllModules(): Promise<void> {
  console.log(chalk.bold('\n🔍 Validating all modules...\n'));

  const modules = await getExistingModules();
  if (modules.length === 0) {
    console.log(chalk.gray('No modules found.\n'));
    return;
  }

  const results = await Promise.all(modules.map(m => validateModule(m)));

  let totalErrors = 0;
  let totalWarnings = 0;

  for (let i = 0; i < modules.length; i++) {
    const moduleId = modules[i];
    const result = results[i];
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    const status = result.valid && result.warnings.length === 0 
      ? chalk.green('✅')
      : result.errors.length > 0
        ? chalk.red('❌')
        : chalk.yellow('⚠️');
    
    const summary = result.valid && result.warnings.length === 0
      ? 'OK'
      : result.errors.length > 0
        ? `${result.errors.length} error(s)`
        : `${result.warnings.length} warning(s)`;

    console.log(`${status} ${moduleId}: ${summary}`);
  }

  console.log();
  console.log(chalk.dim(`Total: ${totalErrors} error(s), ${totalWarnings} warning(s)\n`));
}

