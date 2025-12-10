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
    case 'offer-task':
      // Open task offer modal instead of directly accepting
      if (context.openTaskOffer) {
        context.openTaskOffer(action.task);
      } else {
        // Fallback to direct accept if modal not available
        context.acceptTask(action.task);
      }
      break;
    case 'set-state':
    case 'set-module-state':
      context.setModuleStateField(action.key, action.value);
      break;
    case 'set-interactable-state':
      context.setInteractableState(action.interactableId, action.key, action.value);
      break;
    case 'call-function':
      await action.handler(context);
      break;
    case 'go-to':
    case 'close-dialogue':
    case 'none':
      // Handled separately or no-op
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

