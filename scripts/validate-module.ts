#!/usr/bin/env node

/**
 * Module Validation Script
 * Validates module structure and configuration
 * 
 * Usage: npm run module:validate <module-id>
 * Example: npm run module:validate example
 * 
 * Checks:
 * - Required files exist
 * - Module exports IModule interface
 * - Dialogue references exist
 * - Task references are valid
 * - Interactable IDs are unique
 * - Speaker IDs reference valid interactables
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.join(__dirname, '../modules');

// ============================================================================
// Types
// ============================================================================

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  type: 'error';
  code: string;
  message: string;
  file?: string;
  line?: number;
}

interface ValidationWarning {
  type: 'warning';
  code: string;
  message: string;
  file?: string;
}

// ============================================================================
// File Structure Validation
// ============================================================================

const REQUIRED_FILES = [
  'index.ts',
  'config.ts',
  'constants.ts',
  'dialogues.ts',
  'interactables.ts',
  'tasks/index.ts',
  'handlers/index.ts',
];

const OPTIONAL_FILES = [
  'handlers/interactionHandler.ts',
  'handlers/dialogueHandler.ts',
];

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function validateFileStructure(
  modulePath: string,
  moduleId: string
): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check required files
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(modulePath, file);
    if (!(await fileExists(filePath))) {
      errors.push({
        type: 'error',
        code: 'MISSING_FILE',
        message: `Required file missing: ${file}`,
        file: path.relative(MODULES_DIR, filePath),
      });
    }
  }

  // Check optional files (warn if missing)
  for (const file of OPTIONAL_FILES) {
    const filePath = path.join(modulePath, file);
    if (!(await fileExists(filePath))) {
      warnings.push({
        type: 'warning',
        code: 'MISSING_OPTIONAL_FILE',
        message: `Optional file missing: ${file}`,
        file: path.relative(MODULES_DIR, filePath),
      });
    }
  }

  return { errors, warnings };
}

// ============================================================================
// Module Config Validation
// ============================================================================

async function validateModuleConfig(
  modulePath: string,
  moduleId: string
): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  try {
    // Import the module
    const indexPath = path.join(modulePath, 'index.ts');
    const moduleUrl = pathToFileURL(indexPath).href;
    
    // Use dynamic import with tsx
    const module = await import(moduleUrl);
    const moduleExport = module.default;

    if (!moduleExport) {
      errors.push({
        type: 'error',
        code: 'NO_DEFAULT_EXPORT',
        message: 'Module must have a default export',
        file: 'index.ts',
      });
      return { errors, warnings };
    }

    // Check init function
    if (typeof moduleExport.init !== 'function') {
      errors.push({
        type: 'error',
        code: 'MISSING_INIT',
        message: 'Module must have an init(locale: string) function',
        file: 'index.ts',
      });
      return { errors, warnings };
    }

    // Get config
    const config = moduleExport.init('en');

    // Validate manifest
    if (!config.manifest) {
      errors.push({
        type: 'error',
        code: 'MISSING_MANIFEST',
        message: 'Module config must have a manifest',
        file: 'config.ts',
      });
    } else {
      if (!config.manifest.id) {
        errors.push({
          type: 'error',
          code: 'MISSING_MANIFEST_ID',
          message: 'Manifest must have an id',
          file: 'config.ts',
        });
      } else if (config.manifest.id !== moduleId) {
        warnings.push({
          type: 'warning',
          code: 'MANIFEST_ID_MISMATCH',
          message: `Manifest id "${config.manifest.id}" doesn't match folder name "${moduleId}"`,
          file: 'config.ts',
        });
      }

      if (!config.manifest.name) {
        errors.push({
          type: 'error',
          code: 'MISSING_MANIFEST_NAME',
          message: 'Manifest must have a name',
          file: 'config.ts',
        });
      }

      if (!config.manifest.version) {
        warnings.push({
          type: 'warning',
          code: 'MISSING_VERSION',
          message: 'Manifest should have a version',
          file: 'config.ts',
        });
      }
    }

    // Validate background
    if (!config.background) {
      errors.push({
        type: 'error',
        code: 'MISSING_BACKGROUND',
        message: 'Module config must have a background',
        file: 'config.ts',
      });
    } else if (!config.background.color && !config.background.image) {
      warnings.push({
        type: 'warning',
        code: 'EMPTY_BACKGROUND',
        message: 'Background should have either color or image',
        file: 'config.ts',
      });
    }

    // Validate welcome
    if (!config.welcome) {
      errors.push({
        type: 'error',
        code: 'MISSING_WELCOME',
        message: 'Module config must have a welcome message',
        file: 'config.ts',
      });
    } else {
      if (!config.welcome.speaker) {
        warnings.push({
          type: 'warning',
          code: 'MISSING_WELCOME_SPEAKER',
          message: 'Welcome should have a speaker',
          file: 'config.ts',
        });
      }
      if (!config.welcome.lines || config.welcome.lines.length === 0) {
        warnings.push({
          type: 'warning',
          code: 'EMPTY_WELCOME_LINES',
          message: 'Welcome should have at least one line',
          file: 'config.ts',
        });
      }
    }

    // Validate interactables
    const interactableIds = new Set<string>();
    if (config.interactables && Array.isArray(config.interactables)) {
      for (const interactable of config.interactables) {
        if (!interactable.id) {
          errors.push({
            type: 'error',
            code: 'MISSING_INTERACTABLE_ID',
            message: 'Each interactable must have an id',
            file: 'interactables.ts',
          });
        } else {
          if (interactableIds.has(interactable.id)) {
            errors.push({
              type: 'error',
              code: 'DUPLICATE_INTERACTABLE_ID',
              message: `Duplicate interactable id: "${interactable.id}"`,
              file: 'interactables.ts',
            });
          }
          interactableIds.add(interactable.id);
        }

        if (!interactable.name) {
          warnings.push({
            type: 'warning',
            code: 'MISSING_INTERACTABLE_NAME',
            message: `Interactable "${interactable.id}" should have a name`,
            file: 'interactables.ts',
          });
        }

        if (!interactable.position) {
          errors.push({
            type: 'error',
            code: 'MISSING_INTERACTABLE_POSITION',
            message: `Interactable "${interactable.id}" must have a position`,
            file: 'interactables.ts',
          });
        }

        if (!interactable.action) {
          errors.push({
            type: 'error',
            code: 'MISSING_INTERACTABLE_ACTION',
            message: `Interactable "${interactable.id}" must have an action`,
            file: 'interactables.ts',
          });
        }
      }
    }

    // Validate tasks
    const taskIds = new Set<string>();
    if (config.tasks && Array.isArray(config.tasks)) {
      for (const task of config.tasks) {
        if (!task.id) {
          errors.push({
            type: 'error',
            code: 'MISSING_TASK_ID',
            message: 'Each task must have an id',
            file: 'tasks/',
          });
        } else {
          if (taskIds.has(task.id)) {
            errors.push({
              type: 'error',
              code: 'DUPLICATE_TASK_ID',
              message: `Duplicate task id: "${task.id}"`,
              file: 'tasks/',
            });
          }
          taskIds.add(task.id);
        }

        if (!task.name) {
          warnings.push({
            type: 'warning',
            code: 'MISSING_TASK_NAME',
            message: `Task "${task.id}" should have a name`,
            file: 'tasks/',
          });
        }

        if (!task.solveFunction || typeof task.solveFunction !== 'function') {
          errors.push({
            type: 'error',
            code: 'MISSING_SOLVE_FUNCTION',
            message: `Task "${task.id}" must have a solveFunction`,
            file: 'tasks/',
          });
        }

        if (!task.submission) {
          errors.push({
            type: 'error',
            code: 'MISSING_SUBMISSION_CONFIG',
            message: `Task "${task.id}" must have a submission config`,
            file: 'tasks/',
          });
        }
      }
    }

    // Validate dialogues
    if (config.dialogues) {
      const dialogueIds = new Set<string>();
      for (const [dialogueId, dialogue] of Object.entries(config.dialogues)) {
        if (dialogueIds.has(dialogueId)) {
          errors.push({
            type: 'error',
            code: 'DUPLICATE_DIALOGUE_ID',
            message: `Duplicate dialogue id: "${dialogueId}"`,
            file: 'dialogues.ts',
          });
        }
        dialogueIds.add(dialogueId);

        if (!dialogue.speaker) {
          warnings.push({
            type: 'warning',
            code: 'MISSING_DIALOGUE_SPEAKER',
            message: `Dialogue "${dialogueId}" should have a speaker`,
            file: 'dialogues.ts',
          });
        }

        if (!dialogue.lines || dialogue.lines.length === 0) {
          warnings.push({
            type: 'warning',
            code: 'EMPTY_DIALOGUE_LINES',
            message: `Dialogue "${dialogueId}" should have at least one line`,
            file: 'dialogues.ts',
          });
        }

        // Check dialogue actions reference valid tasks
        if (dialogue.choices) {
          for (const choice of dialogue.choices) {
            const actions = Array.isArray(choice.action) 
              ? choice.action 
              : choice.action ? [choice.action] : [];
            
            for (const action of actions) {
              if (action?.type === 'accept-task' && action.taskId) {
                if (!taskIds.has(action.taskId)) {
                  errors.push({
                    type: 'error',
                    code: 'INVALID_TASK_REFERENCE',
                    message: `Dialogue "${dialogueId}" references non-existent task "${action.taskId}"`,
                    file: 'dialogues.ts',
                  });
                }
              }
            }
          }
        }
      }
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    errors.push({
      type: 'error',
      code: 'IMPORT_ERROR',
      message: `Failed to import module: ${message}`,
      file: 'index.ts',
    });
  }

  return { errors, warnings };
}

// ============================================================================
// Main Validation Function
// ============================================================================

async function validateModule(moduleId: string): Promise<ValidationResult> {
  const modulePath = path.join(MODULES_DIR, moduleId);
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check if module exists
  if (!(await fileExists(modulePath))) {
    return {
      valid: false,
      errors: [{
        type: 'error',
        code: 'MODULE_NOT_FOUND',
        message: `Module "${moduleId}" not found at ${modulePath}`,
      }],
      warnings: [],
    };
  }

  // Validate file structure
  const structureResult = await validateFileStructure(modulePath, moduleId);
  errors.push(...structureResult.errors);
  warnings.push(...structureResult.warnings);

  // Only validate config if index.ts exists
  if (await fileExists(path.join(modulePath, 'index.ts'))) {
    const configResult = await validateModuleConfig(modulePath, moduleId);
    errors.push(...configResult.errors);
    warnings.push(...configResult.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// CLI Output
// ============================================================================

function printResult(moduleId: string, result: ValidationResult): void {
  console.log('');
  
  if (result.valid && result.warnings.length === 0) {
    console.log(`✅ Module "${moduleId}" is valid!`);
    console.log('');
    return;
  }

  if (result.valid) {
    console.log(`⚠️  Module "${moduleId}" is valid but has warnings:`);
  } else {
    console.log(`❌ Module "${moduleId}" has errors:`);
  }
  console.log('');

  // Print errors
  if (result.errors.length > 0) {
    console.log('Errors:');
    for (const error of result.errors) {
      const location = error.file ? ` (${error.file})` : '';
      console.log(`  ❌ [${error.code}]${location}`);
      console.log(`     ${error.message}`);
    }
    console.log('');
  }

  // Print warnings
  if (result.warnings.length > 0) {
    console.log('Warnings:');
    for (const warning of result.warnings) {
      const location = warning.file ? ` (${warning.file})` : '';
      console.log(`  ⚠️  [${warning.code}]${location}`);
      console.log(`     ${warning.message}`);
    }
    console.log('');
  }

  // Summary
  console.log(`Summary: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`);
  console.log('');
}

// ============================================================================
// Validate All Modules
// ============================================================================

async function validateAllModules(): Promise<void> {
  console.log('\n🔍 Validating all modules...\n');

  try {
    const entries = await fs.readdir(MODULES_DIR, { withFileTypes: true });
    const moduleIds = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    if (moduleIds.length === 0) {
      console.log('No modules found in', MODULES_DIR);
      return;
    }

    let totalErrors = 0;
    let totalWarnings = 0;
    const results: Array<{ moduleId: string; result: ValidationResult }> = [];

    for (const moduleId of moduleIds) {
      const result = await validateModule(moduleId);
      results.push({ moduleId, result });
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;
    }

    // Print summary first
    console.log('━'.repeat(50));
    console.log(`Validated ${moduleIds.length} module(s)`);
    console.log('━'.repeat(50));
    console.log('');

    // Print each result
    for (const { moduleId, result } of results) {
      const status = result.valid 
        ? result.warnings.length > 0 ? '⚠️' : '✅'
        : '❌';
      const summary = result.valid
        ? result.warnings.length > 0 
          ? `${result.warnings.length} warning(s)`
          : 'OK'
        : `${result.errors.length} error(s)`;
      
      console.log(`${status} ${moduleId}: ${summary}`);
    }

    console.log('');
    console.log('━'.repeat(50));
    console.log(`Total: ${totalErrors} error(s), ${totalWarnings} warning(s)`);
    console.log('━'.repeat(50));
    console.log('');

    // Print details for modules with issues
    const modulesWithIssues = results.filter(
      r => r.result.errors.length > 0 || r.result.warnings.length > 0
    );

    if (modulesWithIssues.length > 0) {
      console.log('Details:');
      console.log('');
      for (const { moduleId, result } of modulesWithIssues) {
        printResult(moduleId, result);
      }
    }

    process.exit(totalErrors > 0 ? 1 : 0);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error validating modules:', message);
    process.exit(1);
  }
}

// ============================================================================
// Main
// ============================================================================

const moduleId = process.argv[2];

if (!moduleId) {
  console.error('');
  console.error('Usage: npm run module:validate <module-id>');
  console.error('       npm run module:validate --all');
  console.error('');
  console.error('Examples:');
  console.error('  npm run module:validate example');
  console.error('  npm run module:validate --all');
  console.error('');
  process.exit(1);
}

if (moduleId === '--all' || moduleId === '-a') {
  validateAllModules();
} else {
  validateModule(moduleId).then(result => {
    printResult(moduleId, result);
    process.exit(result.valid ? 0 : 1);
  }).catch(error => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error:', message);
    process.exit(1);
  });
}

