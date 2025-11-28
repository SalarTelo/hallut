/**
 * Village Module - Skeleton
 * A placeholder module for the worldmap
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Village module implementation
 */
const villageModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'village',
        name: 'Quaint Village',
        version: '1.0.0',
      },
      background: {
        color: '#2e2e1a',
      },
      welcome: {
        speaker: 'Villager',
        lines: [
          'Welcome to our village!',
          'The townsfolk are busy with their daily activities.',
          'Feel free to explore and see what adventures await.',
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

  // handleInteractableFunction and handleDialogueCompletion are optional
  // and not needed for skeleton modules without interactables
};

export default villageModule;
