#!/usr/bin/env node

/**
 * Module Creation Script (New System)
 * Creates a new module with the new structure
 * 
 * Usage: npm run create:module <module-id>
 * Example: npm run create:module textGen
 * 
 * Generated structure:
 * modules/{moduleId}/
 * ├── index.ts         # Module definition
 * ├── config.ts        # Module configuration
 * └── content/         # Module content
 *     ├── tasks.ts     # Task definitions
 *     ├── interactables.ts # NPCs and objects
 *     └── index.ts     # Content exports
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.join(__dirname, '../modules');

// ============================================================================
// Validation
// ============================================================================

function validateModuleId(id: string): void {
  if (!id) {
    throw new Error('Module ID is required');
  }
  if (!/^[a-z0-9-]+$/.test(id)) {
    throw new Error('Module ID must be lowercase alphanumeric with hyphens (e.g. "my-module")');
  }
}

function toDisplayName(id: string): string {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================================================
// Templates
// ============================================================================

const indexTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName} Module
 * Module definition
 */

import { defineModule } from '../../src/core/module/define.js';
import { createConfig } from './config.js';
import { tasks, interactables } from './content/index.js';

// Create config with tasks
const config = createConfig(tasks);

// Define module
export default defineModule({
  id: '${moduleId}',
  config,
  content: {
    interactables,
    tasks,
  },
});
`;

const configTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName} Module Configuration
 */

import { createModuleConfig, createManifest, colorBackground, createWelcome } from '../../src/utils/builders/modules.js';
import type { Task } from '../../src/core/types/task.js';

// Tasks will be imported from content
export function createConfig(tasks: Task[]) {
  return createModuleConfig({
    manifest: createManifest('${moduleId}', '${displayName}', '1.0.0', 'A ${displayName.toLowerCase()} module'),
    background: colorBackground('#1a1a2e'),
    welcome: createWelcome('System', [
      'Welcome to ${displayName}!',
      'This is your new module.',
    ]),
    taskOrder: tasks, // Direct object references
  });
}
`;

const tasksTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName} Module Tasks
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '../../../src/utils/builders/tasks.js';

/**
 * Example task
 */
export const exampleTask = createTask({
  id: 'example',
  name: 'Example Task',
  description: 'This is an example task. Replace with your own.',
  submission: textSubmission(),
  validate: textLengthValidator(10, (text) => {
    if (text.length >= 10) {
      return success('task_complete', 'Great job!', 100);
    }
    return failure('too_short', 'Please write at least 10 characters.');
  }),
  overview: {
    requirements: 'Write at least 10 characters',
    goals: ['Complete the example task'],
  },
});

/**
 * All tasks
 */
export const tasks = [exampleTask];
`;

const interactablesTemplate = (moduleId: string, displayName: string) => `/**
 * ${displayName} Module Interactables
 */

import {
  createNPC,
  createObject,
  pos,
  choice,
  createDialogue,
} from '../../../src/utils/builders/index.js';
import { exampleTask } from './tasks.js';

/**
 * Example NPC
 */
export const exampleNPC = createNPC({
  id: 'example-npc',
  name: 'Example NPC',
  position: pos(20, 30),
  avatar: '👤',
  dialogues: {
    greeting: createDialogue({
      id: 'greeting',
      speaker: 'Example NPC',
      lines: [
        'Hello!',
        'This is an example NPC.',
      ],
      choices: [
        choice('Accept task')
          .acceptTask(exampleTask)
          .build(),
        choice('Maybe later')
          .build(),
      ],
    }),
  },
});

/**
 * Example Object
 */
export const exampleObject = createObject({
  id: 'example-object',
  name: 'Example Object',
  position: pos(60, 50),
  avatar: '📦',
  interaction: {
    type: 'component',
    component: 'NoteViewer',
    props: {
      content: 'This is an example object. You can interact with it!',
      title: 'Example Note',
    },
  },
});

/**
 * All interactables
 */
export const interactables = [exampleNPC, exampleObject];
`;

const contentIndexTemplate = (moduleId: string) => `/**
 * ${moduleId} Module Content
 * Central export for all content
 */

export * from './tasks.js';
export * from './interactables.js';
`;

// ============================================================================
// Main Script
// ============================================================================

async function createModule(moduleId: string): Promise<void> {
  try {
    validateModuleId(moduleId);

    // Check if module already exists
    const modulePath = path.join(MODULES_DIR, moduleId);
    try {
      await fs.access(modulePath);
      throw new Error(`Module "${moduleId}" already exists at ${modulePath}`);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && (error as any).code !== 'ENOENT') {
        throw error;
      }
    }

    const displayName = toDisplayName(moduleId);

    console.log(`\nCreating module "${moduleId}" (${displayName})...\n`);

    // Create directories
    await fs.mkdir(modulePath, { recursive: true });
    await fs.mkdir(path.join(modulePath, 'content'), { recursive: true });

    // Create files
    const files = [
      ['index.ts', indexTemplate(moduleId, displayName)],
      ['config.ts', configTemplate(moduleId, displayName)],
      ['content/tasks.ts', tasksTemplate(moduleId, displayName)],
      ['content/interactables.ts', interactablesTemplate(moduleId, displayName)],
      ['content/index.ts', contentIndexTemplate(moduleId)],
    ];

    for (const [filename, content] of files) {
      const filePath = path.join(modulePath, filename);
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`   Created ${filename}`);
    }

    console.log(`\nModule "${moduleId}" created successfully!`);
    console.log(`Location: ${modulePath}\n`);
    console.log('Next steps:');
    console.log('   1. Edit config.ts to customize manifest, background, and welcome message');
    console.log('   2. Edit content/tasks.ts to create your tasks');
    console.log('   3. Edit content/interactables.ts to add NPCs and objects');
    console.log('   4. Run: npm run dev to test your module');
    console.log('\nTips:');
    console.log('   - Use builders: import { createTask, createNPC } from "../../src/utils/builders"');
    console.log('   - Reference tasks directly (not by string ID)');
    console.log('   - Use pos(x, y) for positioning (0-100)');
    console.log('');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating module:', message);
    process.exit(1);
  }
}

// Get module ID from command line
const moduleId = process.argv[2];

if (!moduleId) {
  console.error('Usage: npm run create:module <module-id>');
  console.error('   Example: npm run create:module textGen');
  console.error('');
  console.error('   Module ID must be lowercase alphanumeric with hyphens.');
  console.error('   Example: text-gen, my-module, castle-guard');
  process.exit(1);
}

createModule(moduleId);

