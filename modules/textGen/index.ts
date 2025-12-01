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

import type { IModule, ModuleContext } from '../../src/types/core/moduleClass.types.js';
import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';
import type { ChoiceAction } from '../../src/types/choiceTypes.js';

// Importera separerad konfiguration
import { manifest, background, welcome } from './config.js';
import { dialogues } from './dialogues.js';
import { guard1 } from './guard1.js';
import { tasks } from './tasks/index.js';
import { handleDialogueCompletion } from './handlers/index.js';

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
      interactables: [guard1],
      tasks,
      requires: [],
    };
  },

  // handleInteractableFunction is no longer needed - guard1 handles everything internally

  async handleChoiceAction(
    dialogueId: string,
    action: ChoiceAction,
    context: ModuleContext
  ): Promise<void> {
    await handleDialogueCompletion(dialogueId, action, context);
  },
};

export default exampleModule;
