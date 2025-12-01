/**
 * Vakthanterare
 * Logik för att bestämma vilken dialog vakten ska visa
 */

import type { ModuleContext, InteractableFunctionResult } from '../../../src/types/core/moduleClass.types.js';
import { DIALOGUE_IDS, TASK_IDS } from '../constants.js';

/**
 * Bestämmer vilken dialog vakten ska visa baserat på uppgiftsstatus
 */
export function getGuardDialogue(context: ModuleContext): InteractableFunctionResult {
  const storyCompleted = context.isTaskCompleted(TASK_IDS.STORY);
  const recipeCompleted = context.isTaskCompleted(TASK_IDS.RECIPE);
  const activeTaskId = context.getCurrentTaskId();

  // Båda uppgifterna klara - visa slutförande
  if (storyCompleted && recipeCompleted) {
    return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUARD_COMPLETE };
  }

  // Berättelseuppgiften är aktiv och inte klar - kolla om redo
  if (activeTaskId === TASK_IDS.STORY && !storyCompleted) {
    return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUARD_TASK1_READY };
  }

  // Berättelsen klar, receptet inte påbörjat - erbjud receptuppgift
  if (storyCompleted && !recipeCompleted && !activeTaskId) {
    return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUARD_TASK2_OFFER };
  }

  // Receptuppgiften är aktiv och inte klar - kolla om redo
  if (activeTaskId === TASK_IDS.RECIPE && !recipeCompleted) {
    return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUARD_TASK2_READY };
  }

  // Ingen uppgift aktiv - erbjud berättelseuppgift
  if (!activeTaskId) {
    return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUARD_TASK1_OFFER };
  }

  // Reserv till hälsning
  return { type: 'dialogue', dialogueId: DIALOGUE_IDS.GUARD_GREETING };
}
