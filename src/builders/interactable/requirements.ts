/**
 * Interactable Requirement Builders
 * Functions for creating unlock requirements for interactables
 */

import type { UnlockRequirement } from '@core/unlock/types.js';
import type { Task } from '@core/task/types.js';

/**
 * Create a task completion requirement
 */
export function taskComplete(task: Task): UnlockRequirement {
  return {
    type: 'task-complete',
    task,
  };
}

/**
 * Create a module completion requirement
 */
export function moduleComplete(moduleId: string): UnlockRequirement {
  return {
    type: 'module-complete',
    moduleId,
  };
}

/**
 * Create a state check requirement
 */
export function stateCheck(key: string, value: unknown): UnlockRequirement {
  return {
    type: 'state-check',
    key,
    value,
  };
}

