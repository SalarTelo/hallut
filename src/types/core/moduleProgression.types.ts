/**
 * Module Progression
 * Tracks module states (locked/unlocked/completed) for the module selection system
 * No dependencies - foundation type
 */

/**
 * Module progression state
 */
export type ModuleProgressionState = 'locked' | 'unlocked' | 'completed';

/**
 * Module progression data
 */
export interface ModuleProgression {
  /**
   * Module ID
   */
  moduleId: string;

  /**
   * Current progression state
   */
  state: ModuleProgressionState;

  /**
   * Timestamp when module was unlocked (if unlocked/completed)
   */
  unlockedAt?: number;

  /**
   * Timestamp when module was completed (if completed)
   */
  completedAt?: number;
}

/**
 * Module progression map
 * Maps module IDs to their progression state
 */
export interface ModuleProgressionMap {
  [moduleId: string]: ModuleProgression;
}
