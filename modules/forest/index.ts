/**
 * Forest Module - Skeleton
 * A placeholder module for the worldmap
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Forest module implementation
 */
const forestModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'forest',
        name: 'Mystic Forest',
        version: '1.0.0',
      },
      background: {
        color: '#1a2e1a',
      },
      welcome: {
        speaker: 'Guide',
        lines: [
          'You enter the mystic forest.',
          'Tall trees surround you, their leaves rustling in the wind.',
          'The path ahead is shrouded in mystery.',
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

  // handleInteractableFunction and handleDialogueCompletion are optional
  // and not needed for skeleton modules without interactables
};

export default forestModule;
