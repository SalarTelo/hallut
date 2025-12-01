/**
 * Unlock Service
 * Handles all module unlocking logic reactively
 */

import { getModule, getRegisteredModuleIds } from '../module/registry.js';
import { actions } from '../state/actions.js';
import { checkUnlockRequirement, requiresUserInteraction } from './unlockRequirement.js';
import { isModuleFullyCompleted } from '../../services/moduleService.js';
import type { UnlockContext } from '../types/unlock.js';

/**
 * Check if a module can be unlocked
 */
export async function canUnlockModule(
  moduleId: string,
  context: { password?: string } = {}
): Promise<{ canUnlock: boolean; requiresInteraction: boolean }> {
  const module = getModule(moduleId);
  if (!module) {
    return { canUnlock: false, requiresInteraction: false };
  }

  const config = module.config;
  const currentState = actions.getModuleProgression(moduleId);

  // Already unlocked or completed
  if (currentState === 'unlocked' || currentState === 'completed') {
    return { canUnlock: false, requiresInteraction: false };
  }

  // If no unlock requirement, module is always unlockable
  if (!config.unlockRequirement) {
    return { canUnlock: true, requiresInteraction: false };
  }

  // Handle password requirement
  if (config.unlockRequirement.type === 'password') {
    if (!context.password) {
      return { canUnlock: false, requiresInteraction: true };
    }
    const correct = context.password === config.unlockRequirement.password;
    return { canUnlock: correct, requiresInteraction: true };
  }

  // Check other requirements
  const unlockContext: UnlockContext = {
    moduleId,
  };
  
  const met = await checkUnlockRequirement(
    config.unlockRequirement,
    unlockContext
  );
  
  const needsInteraction = requiresUserInteraction(config.unlockRequirement);
  
  return { 
    canUnlock: met, 
    requiresInteraction: needsInteraction && !met 
  };
}

/**
 * Attempt to unlock a module
 */
export async function unlockModule(
  moduleId: string,
  password?: string
): Promise<{ success: boolean; requiresPassword: boolean }> {
  const { canUnlock, requiresInteraction } = await canUnlockModule(moduleId, { password });

  if (requiresInteraction && !password) {
    return { success: false, requiresPassword: true };
  }

  if (canUnlock) {
    actions.unlockModule(moduleId);
    return { success: true, requiresPassword: false };
  }

  return { success: false, requiresPassword: false };
}

/**
 * Evaluate if a module is complete and unlock dependents
 */
export async function evaluateModuleCompletion(moduleId: string): Promise<void> {
  const isCompleted = await isModuleFullyCompleted(moduleId);
  
  if (!isCompleted) {
    return;
  }

  // Mark module as completed
  actions.completeModule(moduleId);

  // Find all modules that depend on this one
  const allModules = getRegisteredModuleIds();
  const modulesToUnlock: string[] = [];

  for (const otherModuleId of allModules) {
    const { canUnlock } = await canUnlockModule(otherModuleId);
    if (canUnlock) {
      const currentState = actions.getModuleProgression(otherModuleId);
      if (currentState === 'locked') {
        modulesToUnlock.push(otherModuleId);
      }
    }
  }

  // Unlock dependent modules
  for (const moduleIdToUnlock of modulesToUnlock) {
    await unlockModule(moduleIdToUnlock);
  }
}

/**
 * Initialize module progression
 * Unlocks modules with no requirements or requirements already met
 */
export async function initializeModuleProgression(moduleIds?: string[]): Promise<void> {
  const ids = moduleIds || getRegisteredModuleIds();

  // First, lock everything (except completed)
  for (const moduleId of ids) {
    const state = actions.getModuleProgression(moduleId);
    if (state !== 'completed') {
      actions.setModuleProgression(moduleId, 'locked');
    }
  }

  // Then, unlock modules with no requirements or requirements already met
  const toUnlock: string[] = [];
  for (const moduleId of ids) {
    const { canUnlock, requiresInteraction } = await canUnlockModule(moduleId);
    if (canUnlock && !requiresInteraction) {
      toUnlock.push(moduleId);
    }
  }

  // Unlock them
  for (const moduleId of toUnlock) {
    actions.unlockModule(moduleId);
  }
}

