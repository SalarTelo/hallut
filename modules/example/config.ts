/**
 * Example Module Configuration
 */

import { createModuleConfig, createManifest, colorBackground, createWelcome } from '../../src/utils/builders/modules.js';
import type { Task } from '../../src/core/types/task.js';

// Tasks will be imported from content
export function createConfig(tasks: Task[]) {
  return createModuleConfig({
    manifest: createManifest('example', 'Starting Point', '1.0.0', 'Your journey begins here. Choose your path and explore the world!'),
    background: colorBackground('#1a1a2e'),
    welcome: createWelcome('System', [
      'Welcome to the Example Module!',
      'This is a demonstration of the new module system.',
      'Click on NPCs and objects to interact with them.',
    ]),
    taskOrder: tasks, // Direct object references
    // No requires = starting point (will be positioned on the left)
  });
}

