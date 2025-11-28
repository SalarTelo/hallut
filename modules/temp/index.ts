/**
 * Temp-modul
 * Huvudmodulens ingångspunkt som implementerar IModule-gränssnittet
 * 
 * Filstruktur:
 * - index.ts: Modulens ingångspunkt (denna fil)
 * - config.ts: Manifest, bakgrund, välkomstmeddelande
 * - constants.ts: ID:n och funktionsnamn
 * - dialogues.ts: Dialogdefinitioner
 * - interactables.ts: Interaktiva objekt/NPC:er
 * - tasks/: Uppgiftsdefinitioner
 * - handlers/: Händelsehanterare
 */

import type { IModule, InteractableFunctionResult, ModuleContext } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';
import type { DialogueCompletionAction } from '../../src/types/dialogue.types.js';

import { manifest, background, welcome } from './config.js';
import { dialogues } from './dialogues.js';
import { interactables } from './interactables.js';
import { tasks } from './tasks/index.js';
import { handleInteraction, handleDialogueCompletion } from './handlers/index.js';
import { INTERACTABLE_IDS, FUNCTION_NAMES } from './constants.js';

/**
 * Temp-modulens implementation
 */
const tempModule: IModule = {
  init(_locale: string): ModuleConfig {
    return {
      manifest,
      background,
      welcome,
      dialogues,
      interactables,
      tasks,
      requires: [],
    };
  },

  handleInteractableFunction(
    interactableId: string,
    functionName: string,
    context: ModuleContext
  ): InteractableFunctionResult {
    return handleInteraction(interactableId, functionName, context);
  },

  async handleDialogueCompletion(
    dialogueId: string,
    action: DialogueCompletionAction,
    context: ModuleContext
  ): Promise<void> {
    await handleDialogueCompletion(dialogueId, action, context);
  },
};

export default tempModule;
