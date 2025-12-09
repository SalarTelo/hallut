/**
 * Unlock Requirements
 * Service for checking unlock requirements
 */

import type { UnlockRequirement, UnlockContext } from './types.js';
import { actions } from '../state/actions.js';
import { findTaskModule } from '../module/utils.js';
import { getTaskId } from '../task/utils.js';

/**
 * Check if an unlock requirement is met
 */
export async function checkUnlockRequirement(
  requirement: UnlockRequirement,
  context: UnlockContext = {}
): Promise<boolean> {
  switch (requirement.type) {
    case 'task-complete':
      // Find which module the task belongs to
      const taskId = getTaskId(requirement.task);
      const taskModuleId = findTaskModule(taskId);
      
      // If we can't find the module, try using context moduleId as fallback
      const moduleIdToCheck = taskModuleId || context.moduleId;
      if (!moduleIdToCheck) return false;
      
      return actions.isTaskCompleted(moduleIdToCheck, requirement.task);

    case 'module-complete':
      return actions.isModuleCompleted(requirement.moduleId);

    case 'state-check':
      const stateValue = actions.getModuleStateField(
        context.moduleId || '',
        requirement.key
      );
      return stateValue === requirement.value;

    case 'password':
      // Password is checked via UI, not here
      // This just indicates it needs user input
      return false; // Always false - requires UI interaction

    case 'and':
      const andResults = await Promise.all(
        requirement.requirements.map(req => 
          checkUnlockRequirement(req, context)
        )
      );
      return andResults.every(r => r === true);

    case 'or':
      const orResults = await Promise.all(
        requirement.requirements.map(req => 
          checkUnlockRequirement(req, context)
        )
      );
      return orResults.some(r => r === true);

    case 'custom':
      return await requirement.check(context);

    default:
      return false;
  }
}

/**
 * Check if requirement needs user interaction (password, etc.)
 */
export function requiresUserInteraction(
  requirement: UnlockRequirement
): boolean {
  if (requirement.type === 'password') return true;
  if (requirement.type === 'and' || requirement.type === 'or') {
    return requirement.requirements.some(req => requiresUserInteraction(req));
  }
  return false;
}

/**
 * Extract all module dependencies from an unlock requirement
 * Returns array of module IDs that this requirement depends on
 */
export function extractModuleDependencies(
  requirement: UnlockRequirement
): string[] {
  const dependencies: string[] = [];

  switch (requirement.type) {
    case 'module-complete':
      dependencies.push(requirement.moduleId);
      break;

    case 'task-complete':
      // Find which module contains this task
      const taskId = getTaskId(requirement.task);
      const taskModuleId = findTaskModule(taskId);
      if (taskModuleId) {
        dependencies.push(taskModuleId);
      }
      break;

    case 'and':
    case 'or':
      requirement.requirements.forEach(req => {
        dependencies.push(...extractModuleDependencies(req));
      });
      break;

    default:
      break;
  }

  return dependencies;
}

/**
 * Extract all requirement types from an unlock requirement
 * Returns array of requirement type identifiers for display
 */
export function extractRequirementTypes(
  requirement: UnlockRequirement
): Array<'password' | 'module-complete' | 'task-complete' | 'state-check' | 'custom'> {
  const types: Array<'password' | 'module-complete' | 'task-complete' | 'state-check' | 'custom'> = [];

  switch (requirement.type) {
    case 'password':
    case 'module-complete':
    case 'task-complete':
    case 'state-check':
    case 'custom':
      types.push(requirement.type);
      break;

    case 'and':
    case 'or':
      requirement.requirements.forEach(req => {
        types.push(...extractRequirementTypes(req));
      });
      break;

    default:
      break;
  }

  return types;
}

/**
 * Detailed requirement info for display
 */
export interface RequirementDisplayInfo {
  type: 'password' | 'module-complete' | 'task-complete' | 'state-check' | 'custom';
  moduleId?: string; // For module-complete
  taskName?: string; // For task-complete
  hint?: string; // For password
}

/**
 * Extract all individual requirements with details for display
 * Expands aggregate requirements (and/or) to show each requirement individually
 */
export function extractRequirementDetails(
  requirement: UnlockRequirement
): RequirementDisplayInfo[] {
  const details: RequirementDisplayInfo[] = [];

  switch (requirement.type) {
    case 'password':
      details.push({
        type: 'password',
        hint: requirement.hint,
      });
      break;

    case 'module-complete':
      details.push({
        type: 'module-complete',
        moduleId: requirement.moduleId,
      });
      break;

    case 'task-complete':
      details.push({
        type: 'task-complete',
        taskName: requirement.task.name,
      });
      break;

    case 'state-check':
      details.push({
        type: 'state-check',
      });
      break;

    case 'custom':
      details.push({
        type: 'custom',
      });
      break;

    case 'and':
    case 'or':
      // Expand aggregate requirements - show each individually
      requirement.requirements.forEach(req => {
        details.push(...extractRequirementDetails(req));
      });
      break;

    default:
      break;
  }

  return details;
}
