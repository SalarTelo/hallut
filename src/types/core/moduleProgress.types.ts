/**
 * Module Progress
 * Structure for storing module progress in persistence
 * Depends on: ModuleState
 */

import type { ModuleState } from './moduleState.types.js';

/**
 * Module progress structure stored in persistence
 */
export interface ModuleProgress {
  /**
   * Core engine state
   */
  state: ModuleState;

  /**
   * Module-specific state (modules define this separately)
   * This allows modules to store custom state without polluting core state
   */
  moduleState?: Record<string, unknown>;
}

