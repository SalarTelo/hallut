/**
 * Module Constants
 * Shared constants used across the module system
 */

import type { UnlockRequirement } from '../types/interactable.types.js';
import { UnlockRequirementType } from '../types/interactable.types.js';

/**
 * Default locale
 */
export const DEFAULT_LOCALE = 'sv';

/**
 * Welcome dialogue ID suffix
 * Format: `${moduleId}_welcome`
 */
export const WELCOME_DIALOGUE_SUFFIX = '_welcome';

/**
 * Generate welcome dialogue ID for a module
 * 
 * @param moduleId - Module ID
 * @returns Welcome dialogue ID
 */
export function getWelcomeDialogueId(moduleId: string): string {
  return `${moduleId}${WELCOME_DIALOGUE_SUFFIX}`;
}

/**
 * Check if an unlock requirement is a task completion requirement
 * Returns the task ID if it is, null otherwise
 * 
 * @param requirement - Typed unlock requirement
 * @returns Task ID if it's a task completion requirement, null otherwise
 */
export function getTaskIdFromRequirement(requirement: UnlockRequirement | null): string | null {
  if (!requirement) {
    return null;
  }
  
  if (requirement.type === UnlockRequirementType.TaskComplete) {
    return requirement.taskId;
  }
  
  return null;
}

/**
 * Check if an unlock requirement is a module completion requirement
 * Returns the module ID if it is, null otherwise
 * 
 * @param requirement - Typed unlock requirement
 * @returns Module ID if it's a module completion requirement, null otherwise
 */
export function getModuleIdFromRequirement(requirement: UnlockRequirement | null): string | null {
  if (!requirement) {
    return null;
  }
  
  if (requirement.type === UnlockRequirementType.ModuleComplete) {
    return requirement.moduleId;
  }
  
  return null;
}

/**
 * Default theme colors
 */
export const DEFAULT_THEME = {
  BORDER_COLOR: '#FFD700',
  BACKGROUND_COLOR: '#1a1a2e',
} as const;
