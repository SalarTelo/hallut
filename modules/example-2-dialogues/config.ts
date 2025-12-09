/**
 * Example 2: Dialogues Module Configuration
 */

import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
} from '@builders/modules.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest(
      'example-2-dialogues',
      'Dialogues Example',
      '1.0.0',
      'Learn about dialogue trees and state management. See docs/module-2-dialogues.md, docs/dialogues.md and docs/building-blocks.md'
    ),
    background: colorBackground('#1a472a'),
    welcome: createWelcome('System', [
      'Welcome to the Dialogues Example!',
      'This module demonstrates dialogue trees and state management.',
      'Talk to the teacher - they will remember you!',
    ]),
    worldmap: {
      position: { x: 35, y: 65 },
      icon: {
        shape: 'circle',
        size: 56,
      },
    },
  });
}

