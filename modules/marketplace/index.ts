/**
 * Marknadsmodul - Skelett
 * En platshållarmodul för världskartan
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Marknadsmodulens implementation
 */
const marketplaceModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'marketplace',
        name: 'Livlig marknad',
        version: '1.0.0',
        summary: 'Handla och interagera med köpmän på den livliga marknaden. Hitta sällsynta föremål och handla klokt.',
      },
      background: {
        color: '#2e2a1a',
      },
      welcome: {
        speaker: 'Köpmann',
        lines: [
          'Välkommen till den livliga marknaden!',
          'Stånden kantas längs gatorna, fyllda med exotiska varor.',
          'Handlare från långt och brett samlas här.',
        ],
      },
      interactables: [],
      tasks: [],
      dialogues: {},
      theme: {
        borderColor: '#f59e0b',
      },
    };
  },

  // handleInteractableFunction och handleDialogueCompletion är valfria
  // och behövs inte för skelettmoduler utan interaktiva objekt
};

export default marketplaceModule;
