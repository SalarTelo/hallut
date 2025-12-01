/**
 * Dialoghanterare
 * Hanterar åtgärder vid dialogslut
 */

import type { ModuleContext } from '../../../src/types/core/moduleClass.types.js';
import type { ChoiceAction } from '../../../src/types/choiceTypes.js';

/**
 * Hantera åtgärd vid dialogslut
 */
export async function handleDialogueCompletion(
  _dialogueId: string,
  action: ChoiceAction,
  context: ModuleContext
): Promise<void> {
  // Hantera funktionsåtgärder
  if (action.type === 'call-function') {
    // Call the handler function directly
    await action.handler(context);
  }
}
