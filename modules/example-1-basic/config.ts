/**
 * Example 1: Basic Module Configuration
 * 
 * Minimal configuration showing only the essentials.
 */

import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
} from '@utils/builders/modules.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest(
      'example-1-basic',
      'Basic Example',
      '1.0.0',
      'A minimal working module - the simplest possible example. See docs/module-1-basic.md, docs/getting-started.md, docs/module-guide.md, docs/building-blocks.md, and docs/core-concepts.md'
    ),
    background: colorBackground('#2d3748'),
    welcome: createWelcome('System', [
      'Welcome to the Basic Example!',
      'This is the simplest possible module.',
      'Click on the NPC to get a task, or click on the sign for information.',
    ]),
    worldmap: {
      position: { x: 15, y: 30 },
      icon: {
        shape: 'circle',
        size: 56,
      },
    },
  });
}

