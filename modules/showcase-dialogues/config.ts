/**
 * Showcase: Dialogues - Module Configuration
 * 
 * Demonstrates dialogue trees, branching, and state-based conversations.
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
      'showcase-dialogues',
      'Showcase: Dialogues',
      '1.0.0',
      'Learn dialogue trees, branching conversations, and state-based dialogues.'
    ),
    background: colorBackground('#2d3748'),
    welcome: createWelcome('Dialogue Guide', [
      'Welcome to the Dialogues showcase!',
      'This module demonstrates:',
      '• Dialogue trees and nodes',
      '• Branching dialogues (choices)',
      '• State-based dialogues (NPC remembers)',
      '• Conditional dialogue entry',
      '• Offering tasks via dialogue',
      '• State management with stateRef',
    ]),
    worldmap: {
      position: { x: 20, y: 30 },
      icon: {
        shape: 'circle',
        size: 56,
      },
      summary: 'Dialogue trees, branching, and state-based conversations',
    },
    unlockRequirement: moduleComplete('module-creator-showcase'),
  });
}
