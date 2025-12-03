/**
 * Example 3B: Module Unlock Module Configuration
 * 
 * This module demonstrates module unlock via module completion.
 * It is unlocked by completing example-3-progression.
 */

import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
  moduleComplete,
} from '@utils/builders/modules.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest(
      'example-3b-module-unlock',
      'Module Unlock Example',
      '1.0.0',
      'Demonstrates module unlock via module completion. See docs/module-3-progression.md'
    ),
    background: colorBackground('#4a3a2a'),
    welcome: createWelcome('System', [
      'Welcome to the Module Unlock Example!',
      'This module was unlocked by completing the Progression Example.',
      'This demonstrates how modules can be unlocked through module completion.',
    ]),
    unlockRequirement: moduleComplete('example-3-progression'),
    worldmap: {
      position: { x: 60, y: 50 },
      icon: {
        shape: 'diamond',
        size: 56,
      },
    },
  });
}

