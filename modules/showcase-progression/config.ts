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
      '1. Task chains (task unlocks task)',
      '2. Locked NPCs (unlock via task completion)',
      '3. Locked objects (unlock via task completion)',
      '4. Combined requirements (AND/OR)',
      '5. Module unlock requirements',
    ]),
    worldmap: {
      position: { x: 80, y: 50 },
      icon: {
        shape: 'circle',
        size: 56,
      },
    },
    unlockRequirement: moduleComplete('module-creator-showcase'),
  });
}
