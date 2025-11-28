/**
 * Modulkonstanter
 * Centraliserade konstanter för exempelmodulen
 */

export const INTERACTABLE_IDS = {
  GUARD: 'guard',
  AI_COMPANION: 'ai-companion',
  FRIDGE: 'fridge',
} as const;

export const TASK_IDS = {
  STORY: 'task-1',
  RECIPE: 'task-2',
} as const;

export const DIALOGUE_IDS = {
  GUARD_GREETING: 'guard-greeting',
  GUARD_TASK1_OFFER: 'guard-task1-offer',
  GUARD_TASK1_READY: 'guard-task1-ready',
  GUARD_TASK2_OFFER: 'guard-task2-offer',
  GUARD_TASK2_READY: 'guard-task2-ready',
  GUARD_COMPLETE: 'guard-complete',
} as const;

export const FUNCTION_NAMES = {
  GUARD_INTERACT: 'guard-interact',
  SUBMIT_TASK: 'submit-task',
} as const;
