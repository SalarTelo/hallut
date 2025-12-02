/**
 * Example Module Configuration
 */

import { createModuleConfig, createManifest, colorBackground, createWelcome } from '@utils/builders/modules.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest('example', 'Starting Point', '1.0.0', 'Your journey begins here. Choose your path and explore the world!'),
    background: colorBackground('#1a1a2e'),
    welcome: createWelcome('System', [
      'Welcome to the Example Module!',
      'This is a demonstration of the new module system.',
      'Click on NPCs and objects to interact with them.',
    ]),
    worldmap: {
      position: { x: 15, y: 50 }, // Starting point - left center
      icon: {
        shape: 'circle',
        size: 56,
      },
    },
  });
}

