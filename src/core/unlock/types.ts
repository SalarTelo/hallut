/**
 * Unlock Requirement Types
 * Unified unlock requirement system for modules and interactables
 */

import type { Task } from '../task/types.js';

/**
 * Context provided when checking unlock requirements
 */
export interface UnlockContext {
  moduleId?: string;
  currentModuleId?: string;
  [key: string]: unknown;
}

/**
 * Unlock requirement types
 * Supports various conditions for unlocking modules and interactables
 */
export type UnlockRequirement =
  | { type: 'task-complete'; task: Task }
  | { type: 'module-complete'; moduleId: string }
  | { type: 'state-check'; key: string; value: unknown }
  | { type: 'password'; password: string; hint?: string }
  | { type: 'and'; requirements: UnlockRequirement[] }
  | { type: 'or'; requirements: UnlockRequirement[] }
  | { type: 'custom'; check: (context: UnlockContext) => Promise<boolean> | boolean };
