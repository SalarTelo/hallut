/**
 * Exempelmodul - Använd som mall för nya moduler
 *
 * Filstruktur:
 * - index.ts: Modulens ingångspunkt (denna fil, implementerar IModule-gränssnittet)
 * - config.ts: Manifest, bakgrundsfärg/bild, välkomstmeddelande
 * - constants.ts: Modulspecifika ID:n och funktionsnamn
 * - dialogues.ts: NPC-dialogdefinitioner
 * - interactables.ts: Klickbara objekt/NPC:er i modulen
 * - tasks/: Uppgiftsdefinitioner och lösningsfunktioner
 * - handlers/: Händelsehanterare för dialoger och villkorlig logik
 *
 * För att skapa en ny modul:
 * 1. Kör: npm run module:create
 * 2. Eller kopiera denna mapp och modifiera
 *
 * IModule-gränssnitt:
 * - init(locale): Returnerar ModuleConfig med all moduldata
 * - handleInteractableFunction(): Hantera klick på interaktiva objekt som behöver logik
 * - handleDialogueCompletion(): Hantera åtgärder vid dialogslut
 */

import type { IModule, InteractableFunctionResult, ModuleContext } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';
import type { DialogueCompletionAction } from '../../src/types/dialogue.types.js';

// Importera separerad konfiguration
import { manifest, background, welcome } from './config.js';
import { dialogues } from './dialogues.js';
import { interactables } from './interactables.js';
import { tasks } from './tasks/index.js';
import { getGuardDialogue, handleDialogueCompletion } from './handlers/index.js';
import { INTERACTABLE_IDS, FUNCTION_NAMES } from './constants.js';

/**
 * Exempelmodulens implementation
 */
const exampleModule: IModule = {
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
    // Vaktens villkorliga dialoglogik
    if (interactableId === INTERACTABLE_IDS.GUARD && functionName === FUNCTION_NAMES.GUARD_INTERACT) {
      return getGuardDialogue(context);
    }

    return { type: 'none' };
  },

  async handleDialogueCompletion(
    dialogueId: string,
    action: DialogueCompletionAction,
    context: ModuleContext
  ): Promise<void> {
    await handleDialogueCompletion(dialogueId, action, context);
  },
};

export default exampleModule;
