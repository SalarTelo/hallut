/**
 * Dialoghanterare
 * Hanterar åtgärder vid dialogslut
 */

import type { ModuleContext } from '../../../src/types/core/moduleClass.types.js';
import type { DialogueCompletionAction } from '../../../src/types/dialogue.types.js';
import { FUNCTION_NAMES } from '../constants.js';

/**
 * Hantera åtgärder vid dialogslut
 * Anropas när en dialog slutar med en 'function'-åtgärdstyp
 */
export async function handleDialogueCompletion(
  _dialogueId: string,
  action: DialogueCompletionAction,
  context: ModuleContext
): Promise<void> {
  // Hantera funktionsåtgärder
  if (action.type === 'function') {
    if (action.functionName === FUNCTION_NAMES.SUBMIT_TASK) {
      // Öppna uppgiftsinlämning för aktuell aktiv uppgift
      const currentTaskId = context.getCurrentTaskId();
      if (currentTaskId && context.openTaskSubmission) {
        context.openTaskSubmission(currentTaskId);
      }
    }
    // Lägg till fler funktionshanterare här
  }
}
