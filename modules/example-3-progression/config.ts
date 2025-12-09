/**
 * Example 3: Progression Module Configuration
 */

import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
} from '@builders/module/index.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest(
      'example-3-progression',
      'Progression Example',
      '1.0.0',
      'Learn about unlock requirements and progression. Complete tasks to unlock new modules! See docs/module-3-progression.md, docs/progression.md and docs/building-blocks.md'
    ),
    background: colorBackground('#4a1a2e'),
    welcome: createWelcome('System', [
      'Welcome to the Progression Example!',
      'This module demonstrates unlock requirements.',
      'Complete tasks to unlock new content!',
    ]),
    worldmap: {
      position: { x: 60, y: 25 },
      icon: {
        shape: 'circle',
        size: 56,
      },
    },
  });
}

