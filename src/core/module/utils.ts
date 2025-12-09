/**
 * Module Utilities
 * Helper functions for working with modules
 */

import { getRegisteredModuleIds, getModule } from './registry.js';

/**
 * Find which module contains a specific task
 * Searches through all registered modules to find the one containing the task
 * 
 * @param taskId - Task ID to search for
 * @returns Module ID that contains the task, or null if not found
 */
export function findTaskModule(taskId: string): string | null {
  const moduleIds = getRegisteredModuleIds();
  for (const moduleId of moduleIds) {
    const module = getModule(moduleId);
    if (module?.content.tasks.some(t => t.id === taskId)) {
      return moduleId;
    }
  }
  return null;
}
