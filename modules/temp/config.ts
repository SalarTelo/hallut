/**
 * Temp-modul Konfiguration
 * Modulmanifest, bakgrund och välkomstinställningar
 */

import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Modulmanifest
 */
export const manifest: ModuleConfig['manifest'] = {
  id: 'temp',
  name: 'Temp',
  version: '1.0.0',
  summary: 'En temporär modul för testning och utveckling. Utforska och experimentera med nya funktioner.',
};

/**
 * Bakgrundskonfiguration
 */
export const background: ModuleConfig['background'] = {
  color: '#2d3748', // Mörk skiffergrå - ändra för att matcha ditt tema
};

/**
 * Välkomstdialog som visas när modulen startas
 */
export const welcome: ModuleConfig['welcome'] = {
  speaker: 'Guide',
  lines: [
    'Välkommen till Temp!',
    'Utforska och interagera med elementen runt omkring dig.',
  ],
};
