/**
 * Test Module Configuration
 * 
 * This file contains the module's configuration including:
 * - Manifest: Module metadata (id, name, version, summary)
 * - Background: Visual background for the module
 * - Welcome: Welcome message shown when entering the module
 * - Unlock Requirement: Conditions that must be met to unlock this module
 * - Worldmap: Position and icon for the module on the worldmap
 */

import { createModuleConfig, createManifest, colorBackground, createWelcome } from '@utils/builders/modules.js';

export function createConfig() {
  return createModuleConfig({
    manifest: createManifest('test', 'Test', '1.0.0', 'A test module'),
    background: colorBackground('#1a1a2e'),
    welcome: createWelcome('System', [
      'Welcome to Test!',
      'This is your new module.',
    ]),
  });
}
