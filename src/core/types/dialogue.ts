/**
 * Dialogue Types
 * Core dialogue type definitions
 */

import type { Task } from './task.js';

/**
 * Choice action types
 * Note: ModuleContext is defined in module.ts to avoid circular dependency
 */
export type ChoiceAction =
  | { type: 'accept-task'; task: Task }
  | { type: 'set-state'; key: string; value: unknown }
  | { type: 'call-function'; handler: (context: import('./module.js').ModuleContext) => void | Promise<void> }
  | { type: 'go-to'; dialogue: DialogueConfig | null }
  | { type: 'none' };

/**
 * Dialogue choice
 */
export interface DialogueChoice {
  text: string;
  action: ChoiceAction | ChoiceAction[] | null;
}

/**
 * Dialogue configuration
 */
export interface DialogueConfig {
  id: string;
  speaker: string;
  lines: string[];
  choices?: DialogueChoice[];
}

