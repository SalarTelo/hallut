/**
 * Showcase: Basics - Module Configuration
 * 
 * Demonstrates basic module structure and configuration.
 * This is the foundation that all modules build upon.
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
      'showcase-basics',
      'Showcase: Basics',
      '1.0.0',
      'Learn the fundamentals: module structure, basic NPCs, objects, and tasks.'
    ),
    background: colorBackground('#2d3748'),
    welcome: createWelcome('Basics Guide', [
      'Welcome to the Basics showcase!',
      'This module demonstrates the fundamental building blocks:',
      '1. Module structure (config.ts, index.ts, content/)',
      '2. Basic NPC without dialogue',
      '3. Basic object (Note viewer)',
      '4. Simple text task',
      '5. Worldmap configuration',
    ]),
    worldmap: {
      position: { x: 30, y: 50 },
      icon: {
        shape: 'circle',
        size: 56,
      },
      summary: 'Fundamental module structure and basic content types',
    },
    unlockRequirement: moduleComplete('module-creator-showcase'),
  });
}
