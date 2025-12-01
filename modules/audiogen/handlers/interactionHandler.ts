/**
 * Interaktionshanterare
 * Bestämmer vilken dialog/åtgärd som ska visas baserat på spelstatus
 */

import type { ModuleContext, InteractableFunctionResult } from '../../../src/types/core/moduleClass.types.js';
import { DIALOGUE_IDS, TASK_IDS, INTERACTABLE_IDS, FUNCTION_NAMES } from '../constants.js';

/**
 * Hantera funktionsanrop för interaktiva objekt
 * Returnerar lämplig dialog baserat på uppgiftsstatus
 */
export function handleInteraction(
  interactableId: string,
  functionName: string,
  context: ModuleContext
): InteractableFunctionResult {
  // Guide-NPC-logik
  if (interactableId === INTERACTABLE_IDS.GUIDE && functionName === FUNCTION_NAMES.GUIDE_INTERACT) {
    return getGuideDialogue(context);
  }

  // Standard: ingen åtgärd
  return { type: 'none' };
}

/**
 * Bestäm vilken dialog guiden ska visa
 */
function getGuideDialogue(context: ModuleContext): InteractableFunctionResult {
  const exampleCompleted = context.isTaskCompleted(TASK_IDS.EXAMPLE);
  const activeTaskId = context.getCurrentTaskId();

  // Alla uppgifter klara
  if (exampleCompleted) {
    return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUIDE_COMPLETE };
  }

  // Uppgiften är aktiv - kolla om redo att skicka in
  if (activeTaskId === TASK_IDS.EXAMPLE) {
    return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUIDE_TASK_READY };
  }

  // Ingen aktiv uppgift - erbjud uppgiften
  return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUIDE_TASK_OFFER };
}
