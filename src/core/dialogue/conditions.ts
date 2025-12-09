/**
 * Dialogue Condition Evaluation
 * Functions for evaluating dialogue conditions
 */

import type { DialogueCondition } from './types.js';
import type { ModuleContext } from '../module/types/index.js';
import type { ModuleData } from '../module/types/index.js';

/**
 * Evaluate a dialogue condition
 * Accepts both DialogueCondition objects and functions for convenience
 */
export function evaluateCondition(
  condition: DialogueCondition | ((context: ModuleContext) => boolean),
  context: ModuleContext,
  moduleData: ModuleData
): boolean {
  // Handle function conditions directly
  if (typeof condition === 'function') {
    return condition(context);
  }

  switch (condition.type) {
    case 'task-complete':
      return context.isTaskCompleted(condition.task);
    case 'task-active':
      return context.getCurrentTaskId() === condition.task.id;
    case 'state-check':
      return context.getModuleStateField(condition.key) === condition.value;
    case 'interactable-state':
      return context.getInteractableState(condition.interactableId, condition.key) === condition.value;
    case 'module-state':
      return context.getModuleStateField(condition.key) === condition.value;
    case 'and':
      return condition.conditions.every(c => evaluateCondition(c, context, moduleData));
    case 'or':
      return condition.conditions.some(c => evaluateCondition(c, context, moduleData));
    case 'custom':
      return condition.check(context);
    default:
      return false;
  }
}

