/**
 * By-modul - Skelett
 * En platshållarmodul för världskartan
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * By-modulens implementation
 */
const villageModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'village',
        name: 'Mysig by',
        version: '1.0.0',
        summary: 'Besök den mysiga byn och träffa dess invånare. Hjälp byborna med deras dagliga sysslor och uppgifter.',
      },
      background: {
        color: '#2e2e1a',
      },
      welcome: {
        speaker: 'Bybo',
        lines: [
          'Välkommen till vår by!',
          'Byborna är upptagna med sina dagliga aktiviteter.',
          'Utforska gärna och se vilka äventyr som väntar.',
        ],
      },
      interactables: [],
      tasks: [],
      dialogues: {},
      theme: {
        borderColor: '#fbbf24',
      },
    };
  },

  // handleInteractableFunction och handleDialogueCompletion är valfria
  // och behövs inte för skelettmoduler utan interaktiva objekt
};

export default villageModule;
