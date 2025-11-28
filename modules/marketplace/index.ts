/**
 * Marketplace Module - Skeleton
 * A placeholder module for the worldmap
 */

import type { IModule } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';

/**
 * Marketplace module implementation
 */
const marketplaceModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest: {
        id: 'marketplace',
        name: 'Bustling Marketplace',
        version: '1.0.0',
      },
      background: {
        color: '#2e2a1a',
      },
      welcome: {
        speaker: 'Merchant',
        lines: [
          'Welcome to the bustling marketplace!',
          'Stalls line the streets, filled with exotic wares.',
          'Traders from far and wide gather here.',
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

  // handleInteractableFunction and handleDialogueCompletion are optional
  // and not needed for skeleton modules without interactables
};

export default marketplaceModule;
