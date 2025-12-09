/**
 * State Types
 * Types for state management
 */

import type { ModuleState } from '../module/types.js';

/**
 * Module progress state
 */
export interface ModuleProgress {
  state: {
    completedTasks: string[];
    currentTaskId?: string;
    seenGreetings: Record<string, boolean>;
    conversations?: Record<string, { branch: 'tree' | string; lastNode?: string }>;
    [key: string]: unknown;
  };
  moduleState?: ModuleState;
}

/**
 * Module progression state
 */
export type ModuleProgressionState = 'locked' | 'unlocked' | 'completed';

/**
 * Module progression
 */
export interface ModuleProgression {
  moduleId: string;
  state: ModuleProgressionState;
  unlockedAt?: number;
  completedAt?: number;
}

