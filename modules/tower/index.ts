/**
 * Tornmodul - Skelett
 * En platshållarmodul för världskartan
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Tornmodulens implementation
 */
const towerModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'tower',
        name: 'Mystiskt torn',
        version: '1.0.0',
        summary: 'Klättra upp i det höga tornet och utforska dess många våningar. Varje nivå håller nya utmaningar och belöningar.',
      },
      background: {
        color: '#1a1a2e',
      },
      welcome: {
        speaker: 'Lärd',
        lines: [
          'Du närmar dig det mystiska tornet.',
          'Uråldrig magi flödar genom dess stenar.',
          'Vägen till kunskap ligger inom.',
        ],
      },
      interactables: [],
      tasks: [],
      dialogues: {},
      theme: {
        borderColor: '#a855f7',
      },
    };
  },

  // handleInteractableFunction och handleDialogueCompletion är valfria
  // och behövs inte för skelettmoduler utan interaktiva objekt
};

export default towerModule;
