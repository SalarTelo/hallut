/**
 * Dungeon-modul - Skelett
 * En platshållarmodul för världskartan
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Dungeon-modulens implementation
 */
const dungeonModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'dungeon',
        name: 'Uråldrig dungeon',
        version: '1.0.0',
        summary: 'Utforska de mörka kryptorna under marken. Farliga fiender och värdefulla skatter väntar de modiga.',
      },
      background: {
        color: '#1a1a1a',
      },
      welcome: {
        speaker: 'Upptäcktsresande',
        lines: [
          'Du går ner i den uråldriga dungeonen.',
          'Facklor fladdrar längs stenväggarna.',
          'Ekon av tidigare äventyr fyller luften.',
        ],
      },
      interactables: [],
      tasks: [],
      dialogues: {},
      theme: {
        borderColor: '#ef4444',
      },
    };
  },

  // handleInteractableFunction och handleDialogueCompletion är valfria
  // och behövs inte för skelettmoduler utan interaktiva objekt
};

export default dungeonModule;
