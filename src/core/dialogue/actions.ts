/**
 * Dialogue Action Execution
 * Functions for executing dialogue choice actions
 */

import type { ChoiceAction } from './types.js';
import type { ModuleContext } from '../module/types/index.js';

/**
 * Execute a single action
 */
async function executeAction(
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
    case 'set-interactable-state':
      context.setInteractableState(action.interactableId, action.key, action.value);
      break;
    case 'set-module-state':
      context.setModuleStateField(action.key, action.value);
      break;
    case 'call-function':
      await action.handler(context);
      break;
    case 'go-to':
      // Navigation is handled separately
      break;
    case 'close-dialogue':
      // Dialogue closing is handled separately in the UI layer
      break;
    case 'none':
      // No action
      break;
  }
}

/**
 * Execute choice actions
 */
export async function executeActions(
  actions: ChoiceAction[],
  context: ModuleContext
): Promise<void> {
  for (const action of actions) {
    await executeAction(action, context);
  }
}

