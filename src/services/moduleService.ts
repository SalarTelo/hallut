/**
 * Module Service
 * Business logic for module progression, unlocking, and completion
 * Does NOT modify state - returns results for action creators to use
 * Depends on: engine (moduleRegistry), stores (read-only via getState)
 */

import { getModuleConfig, getRegisteredModuleIds } from '../engine/moduleRegistry.js';
import { moduleActions } from './actions/moduleActions.js';
import type { ModuleProgressionState } from '../types/core/moduleProgression.types.js';
import { handleError } from './errorService.js';
import { ModuleError, ErrorCode } from '../types/core/error.types.js';
import { INITIALLY_UNLOCKED_MODULES, USE_MANUAL_UNLOCK } from '../constants/worldmap.config.js';

/**
 * Check if a module's dependencies are met
 * 
 * @param moduleId - Module ID
 * @returns True if all dependencies are completed
 */
export async function checkModuleDependencies(moduleId: string): Promise<boolean> {
  const config = await getModuleConfig(moduleId);
  if (!config) {
    return false;
  }

  // If no dependencies, module is always available
  if (!config.requires || config.requires.length === 0) {
    return true;
  }

  // Check if all required modules are completed
  return config.requires.every((requiredModuleId) => moduleActions.isModuleCompleted(requiredModuleId));
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
  const currentState = moduleActions.getModuleProgression(moduleId);
  
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
  const progress = moduleActions.getProgress(moduleId);
  if (!progress) {
    return false;
  }

  const config = await getModuleConfig(moduleId);
  if (!config) {
    return false;
  }

  const completedTasks = progress.state.completedTasks || [];
  const totalTasks = config.tasks.length;

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
    const moduleError = new ModuleError(
      ErrorCode.MODULE_INVALID,
      moduleId,
      `Error checking module completion: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { originalError: error }
    );
    handleError(moduleError);
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
  return moduleActions.getModuleProgression(moduleId);
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
    const currentState = moduleActions.getModuleProgression(moduleId);
    
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
    moduleActions.unlockModuleDirect(moduleId);
  }
  
  for (const moduleId of toLock) {
    moduleActions.setModuleProgression(moduleId, 'locked');
  }
}
