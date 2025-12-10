/**
 * Showcase: Objects - Module Configuration
 * 
 * Demonstrates all object types and interactions.
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
      'showcase-objects',
      'Showcase: Objects',
      '1.0.0',
      'Learn all object types and interaction methods.'
    ),
    background: colorBackground('#2d3748'),
    welcome: createWelcome('Object Guide', [
      'Welcome to the Objects showcase!',
      'This module demonstrates:',
      '• Note viewer',
      '• Sign viewer',
      '• Image viewer',
      '• Video viewer',
      '• Chat window',
      '• Custom component objects',
      '• Locked objects',
    ]),
    worldmap: {
      position: { x: 70, y: 30 },
      icon: {
        shape: 'circle',
        size: 56,
      },
      summary: 'All object types and interaction methods',
    },
    unlockRequirement: moduleComplete('module-creator-showcase'),
  });
}
