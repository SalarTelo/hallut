/**
 * Module Service
 * Business logic for module progression, unlocking, and completion
 * Does NOT modify state - returns results for action creators to use
 * Depends on: core/module (moduleRegistry), core/state (read-only via actions)
 */

import { getModule, getRegisteredModuleIds } from '@core/module/registry.js';
import { actions } from '@core/state/actions.js';
import type { ModuleProgressionState } from '@core/state/types.js';
import type { ModuleConfig } from '@core/types/module.js';

// Configuration constants (can be moved to a config file if needed)
const INITIALLY_UNLOCKED_MODULES: string[] = [];
const USE_MANUAL_UNLOCK = false;

/**
 * Get module config helper
 */
function getModuleConfig(moduleId: string): ModuleConfig | null {
  const module = getModule(moduleId);
  return module?.config || null;
}

/**
 * Check if a module's dependencies are met
 * @deprecated Use unlockService.canUnlockModule instead
 * 
 * @param moduleId - Module ID
 * @returns True if all dependencies are completed
 */
export async function checkModuleDependencies(moduleId: string): Promise<boolean> {
  const config = getModuleConfig(moduleId);
  if (!config) {
    return false;
  }

  // If no unlock requirement, module is always available
  if (!config.unlockRequirement) {
    return true;
  }

  // Use unlockRequirement checker
  const { checkUnlockRequirement } = await import('../core/services/unlockRequirement.js');
  return await checkUnlockRequirement(config.unlockRequirement, { moduleId });
}

/**
 * Check if module should be unlocked based on dependencies
 * Returns whether the module should be unlocked (does not modify state)
 * 
 * @param moduleId - Module ID
 * @returns Object with shouldUnlock and currentState
 */
export async function checkModuleUnlockStatus(moduleId: string): Promise<{
  shouldUnlock: boolean;
  currentState: ModuleProgressionState;
}> {
  const currentState = actions.getModuleProgression(moduleId);
  
  // Already unlocked or completed
  if (currentState === 'unlocked' || currentState === 'completed') {
    return { shouldUnlock: false, currentState };
  }

  // Check dependencies
  const dependenciesMet = await checkModuleDependencies(moduleId);
  return { shouldUnlock: dependenciesMet, currentState };
}

/**
 * Check if a module is completed (all tasks completed)
 * 
 * @param moduleId - Module ID
 * @returns True if all tasks are completed
 */
export async function isModuleFullyCompleted(moduleId: string): Promise<boolean> {
  const progress = actions.getProgress(moduleId);
  if (!progress) {
    return false;
  }

  const module = getModule(moduleId);
  if (!module) {
    return false;
  }

  const completedTasks = progress.state.completedTasks || [];
  const totalTasks = module.content.tasks.length;

  // Module is completed if all tasks are completed and there's at least one task
  return completedTasks.length === totalTasks && totalTasks > 0;
}

/**
 * Check if module should be marked as completed
 * Returns whether the module is fully completed (does not modify state)
 * 
 * @param moduleId - Module ID
 * @returns Object with isCompleted flag and modules that should be unlocked
 */
export async function checkModuleCompletionStatus(moduleId: string): Promise<{
  isCompleted: boolean;
  modulesToUnlock: string[];
}> {
  try {
    const isCompleted = await isModuleFullyCompleted(moduleId);
    
    if (!isCompleted) {
      return { isCompleted: false, modulesToUnlock: [] };
    }

    // Find dependent modules that should be unlocked
    const allModules = getRegisteredModuleIds();
    const modulesToUnlock: string[] = [];
    
    for (const otherModuleId of allModules) {
      const { shouldUnlock } = await checkModuleUnlockStatus(otherModuleId);
      if (shouldUnlock) {
        modulesToUnlock.push(otherModuleId);
      }
    }

    return { isCompleted: true, modulesToUnlock };
  } catch (error) {
    // Log error but don't throw - return safe default
    console.error('Error checking module completion:', error);
    return { isCompleted: false, modulesToUnlock: [] };
  }
}

/**
 * Get module progression state
 * 
 * @param moduleId - Module ID
 * @returns Current progression state
 */
export function getModuleProgressionState(moduleId: string): ModuleProgressionState {
  return actions.getModuleProgression(moduleId);
}

/**
 * Get initialization actions for module progression
 * Returns which modules should be unlocked/locked
 * 
 * @param moduleIds - Array of module IDs to initialize
 * @returns Object with arrays of modules to unlock and lock
 */
export async function getModuleProgressionInitActions(moduleIds: string[]): Promise<{
  toUnlock: string[];
  toLock: string[];
}> {
  const ids = moduleIds.length > 0 ? moduleIds : getRegisteredModuleIds();
  const toUnlock: string[] = [];
  const toLock: string[] = [];

  for (let i = 0; i < ids.length; i++) {
    const moduleId = ids[i];
    const currentState = actions.getModuleProgression(moduleId);
    
    // Preserve completed modules
    if (currentState === 'completed') {
      continue;
    }
    
    // Use manual unlock configuration if enabled
    if (USE_MANUAL_UNLOCK && INITIALLY_UNLOCKED_MODULES.length > 0) {
      if (INITIALLY_UNLOCKED_MODULES.includes(moduleId)) {
        const { shouldUnlock, currentState: state } = await checkModuleUnlockStatus(moduleId);
        if (shouldUnlock || state !== 'unlocked') {
          toUnlock.push(moduleId);
        }
      } else {
        toLock.push(moduleId);
      }
    } else {
      // Default behavior: unlock first two modules, lock the rest
      if (i < 2) {
        const { shouldUnlock, currentState: state } = await checkModuleUnlockStatus(moduleId);
        if (shouldUnlock || state !== 'unlocked') {
          toUnlock.push(moduleId);
        }
      } else {
        toLock.push(moduleId);
      }
    }
  }

  return { toUnlock, toLock };
}

/**
 * Initialize module progression
 * Unlocks only the first two modules, locks all others
 * 
 * @param moduleIds - Optional array of module IDs to initialize. If not provided, uses registered modules.
 */
export async function initializeModuleProgression(moduleIds?: string[]): Promise<void> {
  const ids = moduleIds || getRegisteredModuleIds();
  const { toUnlock, toLock } = await getModuleProgressionInitActions(ids);
  
  for (const moduleId of toUnlock) {
    actions.unlockModule(moduleId);
  }
  
  for (const moduleId of toLock) {
    actions.setModuleProgression(moduleId, 'locked');
  }
}
