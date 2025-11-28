/**
 * Dungeon Module - Skeleton
 * A placeholder module for the worldmap
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Dungeon module implementation
 */
const dungeonModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'dungeon',
        name: 'Ancient Dungeon',
        version: '1.0.0',
      },
      background: {
        color: '#1a1a1a',
      },
      welcome: {
        speaker: 'Explorer',
        lines: [
          'You descend into the ancient dungeon.',
          'Torches flicker along the stone walls.',
          'Echoes of past adventures fill the air.',
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

  // handleInteractableFunction and handleDialogueCompletion are optional
  // and not needed for skeleton modules without interactables
};

export default dungeonModule;
