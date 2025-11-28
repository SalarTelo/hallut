/**
 * Tower Module - Skeleton
 * A placeholder module for the worldmap
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Tower module implementation
 */
const towerModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'tower',
        name: 'Mystical Tower',
        version: '1.0.0',
      },
      background: {
        color: '#1a1a2e',
      },
      welcome: {
        speaker: 'Scholar',
        lines: [
          'You approach the mystical tower.',
          'Ancient magic courses through its stones.',
          'The path to knowledge lies within.',
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

  // handleInteractableFunction and handleDialogueCompletion are optional
  // and not needed for skeleton modules without interactables
};

export default towerModule;
