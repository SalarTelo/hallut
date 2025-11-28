/**
 * Exempelmodul Konfiguration
 * Modulmanifest, bakgrund och välkomstinställningar
 */

import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Modulmanifest
 */
export const manifest: ModuleConfig['manifest'] = {
  id: 'example',
  name: 'Slottsporten',
  version: '1.0.0',
};

/**
 * Bakgrundskonfiguration
 */
export const background: ModuleConfig['background'] = {
  color: '#2d1b1b',
};

/**
 * Välkomstdialog
 */
export const welcome: ModuleConfig['welcome'] = {
  speaker: 'Vakt',
  lines: [
    'Du närmar dig slottsporten.',
    'En vakt står framför dig och blockerar ingången.',
    '"Jag kan inte släppa in dig förrän du hjälpt mig med några saker," säger han.',
  ],
};
