/**
 * Dialogue Action Helpers
 * Functions for creating dialogue choice actions
 */

import type { ChoiceAction, DialogueNode } from '@core/dialogue/types.js';
import type { Task } from '@core/task/types.js';
import type { ModuleContext } from '@core/module/types/index.js';

/**
 * Create an accept task action
 */
export function acceptTask(task: Task): ChoiceAction {
  return { type: 'accept-task', task };
}

/**
 * Create a set state action
 */
export function setState(key: string, value: unknown): ChoiceAction {
  return { type: 'set-state', key, value };
}

/**
 * Create a set interactable state action
 */
export function setInteractableState(interactableId: string, key: string, value: unknown): ChoiceAction {
  return { type: 'set-interactable-state', interactableId, key, value };
}

/**
 * Create a set module state action
 */
export function setModuleState(key: string, value: unknown): ChoiceAction {
  return { type: 'set-module-state', key, value };
}

/**
 * Create a call function action
 */
export function callFunction(handler: (context: ModuleContext) => void | Promise<void>): ChoiceAction {
  return { type: 'call-function', handler };
}

/**
 * Create a go-to node action
 */
export function goToNode(node: DialogueNode | null): ChoiceAction {
  return { type: 'go-to', node };
}

/**
 * Create a close dialogue action
 */
export function closeDialogue(): ChoiceAction {
  return { type: 'close-dialogue' };
}

