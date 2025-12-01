/**
 * State Types
 * Types for state management
 */

/**
 * Module progress state
 */
export interface ModuleProgress {
  state: {
    completedTasks: string[];
    currentTaskId?: string;
    seenGreetings: Record<string, boolean>;
    [key: string]: unknown;
  };
  moduleState?: Record<string, unknown>;
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

