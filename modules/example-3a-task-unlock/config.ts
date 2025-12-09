/**
 * Example 3A: Task Unlock Module Configuration
 * 
 * This module demonstrates module unlock via task completion.
 * It is unlocked by completing module3UnlockTask in example-3-progression.
 */

import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
} from '@builders/module/index.js';
import { taskComplete } from '@builders/interactable/index.js';
import { module3UnlockTask } from '../example-3-progression/content/tasks.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest(
      'example-3a-task-unlock',
      'Task Unlock Example',
      '1.0.0',
      'Demonstrates module unlock via task completion. See docs/module-3-progression.md'
    ),
    background: colorBackground('#3a2a4a'),
    welcome: createWelcome('System', [
      'Welcome to the Task Unlock Example!',
      'This module was unlocked by completing a task in the Progression Example.',
      'This demonstrates how modules can be unlocked through task completion.',
    ]),
    unlockRequirement: taskComplete(module3UnlockTask),
    worldmap: {
      position: { x: 75, y: 45 },
      icon: {
        shape: 'square',
        size: 56,
      },
    },
  });
}

