/**
 * Dialogue Service
 * Business logic for dialogue management
 */

import type { ChoiceAction } from '../types/dialogue.js';
import type { ModuleContext } from '../types/module.js';

// Re-export dialogue retrieval function
export { getDialogue } from './dialogueRetrieval.js';

/**
 * Process dialogue action
 */
export async function processDialogueAction(
  action: ChoiceAction,
  context: ModuleContext
): Promise<void> {
  switch (action.type) {
    case 'accept-task':
      context.acceptTask(action.task);
      break;

    case 'set-state':
      context.setModuleStateField(action.key, action.value);
      break;

    case 'call-function':
      await action.handler(context);
      break;

    case 'go-to':
      // go-to is handled by dialogue routing, not here
      break;

    case 'none':
      // No action
      break;
  }
}

/**
 * Process multiple dialogue actions
 */
export async function processDialogueActions(
  actions: ChoiceAction | ChoiceAction[],
  context: ModuleContext
): Promise<void> {
  const actionArray = Array.isArray(actions) ? actions : [actions];

  for (const action of actionArray) {
    await processDialogueAction(action, context);
  }
}

