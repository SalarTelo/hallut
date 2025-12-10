/**
 * Module Creator Showcase - Hub Module Configuration
 * 
 * This is the main hub module that serves as the entry point to all showcase submodules.
 * It demonstrates basic module configuration and serves as a navigation center.
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
      'module-creator-showcase',
      'Module Creator Showcase',
      '1.0.0',
      'A comprehensive showcase of all module creation features. Explore submodules to learn about NPCs, tasks, objects, dialogues, progression, and advanced features.'
    ),
    background: colorBackground('#1a202c'),
    welcome: createWelcome('Showcase System', [
      'Welcome to the Module Creator Showcase!',
      'This hub module demonstrates the foundation of module creation.',
      'Complete the exploration task to unlock all showcase submodules.',
      'Each submodule focuses on specific aspects of module development.',
      'Explore them in any order to learn what you need.',
    ]),
    worldmap: {
      position: { x: 50, y: 50 },
      icon: {
        shape: 'circle',
        size: 64,
      },
      summary: 'Comprehensive showcase of all module creation features',
    },
  });
}
