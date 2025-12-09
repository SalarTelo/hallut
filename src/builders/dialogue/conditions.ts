/**
 * Dialogue Condition Helpers
 * Functions for creating dialogue conditions
 */

import type { DialogueCondition } from '@core/dialogue/types.js';
import type { Task } from '@core/task/types.js';
import type { ModuleContext } from '@core/module/types/index.js';

/**
 * Create a task completion condition
 */
export function taskComplete(task: Task): DialogueCondition {
  return { type: 'task-complete', task };
}

/**
 * Create a task active condition
 */
export function taskActive(task: Task): DialogueCondition {
  return { type: 'task-active', task };
}

/**
 * Create a state check condition
 */
export function stateCheck(key: string, value: unknown): DialogueCondition {
  return { type: 'state-check', key, value };
}

/**
 * Create an interactable state check condition
 */
export function interactableStateCheck(interactableId: string, key: string, value: unknown): DialogueCondition {
  return { type: 'interactable-state', interactableId, key, value };
}

/**
 * Create a module state check condition
 */
export function moduleStateCheck(key: string, value: unknown): DialogueCondition {
  return { type: 'module-state', key, value };
}

/**
 * Create an AND condition
 */
export function andConditions(...conditions: DialogueCondition[]): DialogueCondition {
  return { type: 'and', conditions };
}

/**
 * Create an OR condition
 */
export function orConditions(...conditions: DialogueCondition[]): DialogueCondition {
  return { type: 'or', conditions };
}

/**
 * Create a custom condition
 */
export function customCondition(check: (context: ModuleContext) => boolean): DialogueCondition {
  return { type: 'custom', check };
}

