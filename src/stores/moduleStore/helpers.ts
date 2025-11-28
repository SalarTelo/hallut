/**
 * Module Store Helpers
 * Helper functions for state updates
 */

import type { ModuleProgress } from '../../types/core/moduleProgress.types.js';

/**
 * Helper function to update core state field
 */
export function updateCoreState(
  moduleId: string,
  key: string,
  value: unknown,
  progress: ModuleProgress,
  updateProgress: (moduleId: string, updates: Partial<ModuleProgress>) => void
): void {
  updateProgress(moduleId, {
    state: {
      ...progress.state,
      [key]: value,
    },
  });
}

/**
 * Helper function to update custom module state field
 */
export function updateCustomState(
  moduleId: string,
  key: string,
  value: unknown,
  progress: ModuleProgress,
  updateProgress: (moduleId: string, updates: Partial<ModuleProgress>) => void
): void {
  updateProgress(moduleId, {
    moduleState: {
      ...(progress.moduleState || {}),
      [key]: value,
    },
  });
}

