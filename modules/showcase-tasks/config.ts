/**
 * Showcase: Tasks - Module Configuration
 * 
 * Demonstrates all task types, validators, and task features.
 */

import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
  moduleComplete,
} from '@builders/module/index.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest(
      'showcase-tasks',
      'Showcase: Tasks',
      '1.0.0',
      'Learn all task types, validators, and task features.'
    ),
    background: colorBackground('#2d3748'),
    welcome: createWelcome('Task Guide', [
      'Welcome to the Tasks showcase!',
      'This module demonstrates:',
      '• Text tasks with validators (length, word count, keywords)',
      '• Multiple choice tasks',
      '• Image submission tasks',
      '• Code submission tasks',
      '• Custom submission tasks',
      '• Task dialogues and metadata',
    ]),
    worldmap: {
      position: { x: 50, y: 30 },
      icon: {
        shape: 'circle',
        size: 56,
      },
      summary: 'All task types, validators, and task features',
    },
    unlockRequirement: moduleComplete('module-creator-showcase'),
  });
}
