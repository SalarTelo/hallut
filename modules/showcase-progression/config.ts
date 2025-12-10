/**
 * Showcase: Progression - Module Configuration
 * 
 * Demonstrates unlock requirements, task chains, and progression systems.
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
      'showcase-progression',
      'Showcase: Progression',
      '1.0.0',
      'Learn unlock requirements, task chains, and progression systems.'
    ),
    background: colorBackground('#2d3748'),
    welcome: createWelcome('Progression Guide', [
      'Welcome to the Progression showcase!',
      'This module demonstrates:',
      '• Task chains (task unlocks task)',
      '• Locked NPCs (unlock via task completion)',
      '• Locked objects (unlock via task completion)',
      '• Combined requirements (AND/OR)',
      '• Module unlock requirements',
    ]),
    worldmap: {
      position: { x: 80, y: 50 },
      icon: {
        shape: 'circle',
        size: 56,
      },
      summary: 'Unlock requirements, task chains, and progression',
    },
    unlockRequirement: moduleComplete('module-creator-showcase'),
  });
}
