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
  summary: 'Börja din resa vid slottsporten. Hjälp vakten med uppgifter för att få tillgång till slottet.',
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
