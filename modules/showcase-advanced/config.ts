/**
 * Showcase: Advanced - Module Configuration
 * 
 * Demonstrates advanced features: password locks, handlers, custom components, and state management.
 * 
 * ⚠️ This module is password-protected!
 * Password: "advanced123"
 */

import {
  createModuleConfig,
  createManifest,
  colorBackground,
  createWelcome,
  passwordUnlock,
} from '@builders/module/index.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest(
      'showcase-advanced',
      'Showcase: Advanced',
      '1.0.0',
      'Learn advanced features: password locks, handlers, custom components, and state management.'
    ),
    background: colorBackground('#2d3748'),
    welcome: createWelcome('Advanced Guide', [
      'Welcome to the Advanced showcase!',
      'This module demonstrates:',
      '• Password unlock requirements',
      '• Module handlers (onChoiceAction)',
      '• Custom component renderers',
      '• Complex state management',
      '• Module context usage',
      '',
      'This module was unlocked with a password!',
    ]),
    worldmap: {
      position: { x: 50, y: 70 },
      icon: {
        shape: 'circle',
        size: 56,
      },
      summary: 'Password locks, handlers, custom components, and advanced state',
    },
    unlockRequirement: passwordUnlock(
      'advanced123',
      'The password is "advanced123" - this demonstrates password-protected modules'
    ),
  });
}
