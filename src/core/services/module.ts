/**
 * Module Service
 * Business logic for module progression and unlocking
 */

import { getModule } from '../module/registry.js';
import { actions } from '../state/actions.js';
import type { ModuleProgressionState } from '../state/types.js';
import { extractModuleDependencies } from './unlockRequirement.js';

/**
 * Check if a module's dependencies are met
 */
export async function checkModuleDependencies(moduleId: string): Promise<boolean> {
  const module = getModule(moduleId);
  if (!module) {
    return false;
  }

  const unlockRequirement = module.config.unlockRequirement;
  if (!unlockRequirement) {
    return true;
  }

  const dependencies = extractModuleDependencies(unlockRequirement);
  if (dependencies.length === 0) {
    return true;
  }

  return dependencies.every((requiredModuleId) => actions.isModuleCompleted(requiredModuleId));
}

/**
 * Check if module should be unlocked
 */
export async function checkModuleUnlockStatus(moduleId: string): Promise<{
  shouldUnlock: boolean;
  currentState: ModuleProgressionState;
}> {
  const currentState = actions.getModuleProgression(moduleId);

  if (currentState === 'unlocked' || currentState === 'completed') {
    return { shouldUnlock: false, currentState };
  }

  const dependenciesMet = await checkModuleDependencies(moduleId);
  return { shouldUnlock: dependenciesMet, currentState };
}

/**
 * Check if module is fully completed (all tasks done)
 */
export async function isModuleFullyCompleted(moduleId: string): Promise<boolean> {
  const module = getModule(moduleId);
  if (!module) {
    return false;
  }

  const progress = actions.getProgress(moduleId);
  if (!progress) {
    return false;
  }

  const completedTasks = progress.state.completedTasks || [];
  const totalTasks = module.content.tasks.length;

  return completedTasks.length === totalTasks && totalTasks > 0;
}

/**
 * Check module completion status and modules to unlock
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
    const { getRegisteredModuleIds } = await import('../module/registry.js');
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
    return { isCompleted: false, modulesToUnlock: [] };
  }
}

