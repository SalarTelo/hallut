/**
 * Skogsmodul - Skelett
 * En platshållarmodul för världskartan
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Skogsmodulens implementation
 */
const forestModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'forest',
        name: 'Mystisk skog',
        version: '1.0.0',
        summary: 'Vandra genom den mystiska skogen där dolda hemligheter och utmaningar väntar. Var försiktig med vad du möter.',
      },
      background: {
        color: '#1a2e1a',
      },
      welcome: {
        speaker: 'Guide',
        lines: [
          'Du går in i den mystiska skogen.',
          'Höga träd omger dig, deras löv prasslar i vinden.',
          'Vägen framåt är höljd i mystik.',
        ],
      },
      interactables: [],
      tasks: [],
      dialogues: {},
      theme: {
        borderColor: '#4ade80',
      },
    };
  },

  // handleInteractableFunction och handleDialogueCompletion är valfria
  // och behövs inte för skelettmoduler utan interaktiva objekt
};

export default forestModule;
