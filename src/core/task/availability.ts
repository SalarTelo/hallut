/**
 * Task Availability
 * Checks task availability based on unlockRequirement
 */

import { actions } from '../state/actions.js';
import type { Task } from './types.js';
import type { ModuleContext } from '../module/types.js';
import type { ModuleData } from '../module/types.js';

/**
 * Check if a task is available (unlock requirement met and not completed)
 */
export function isTaskAvailable(
  task: Task,
  context: ModuleContext,
  moduleData: ModuleData
): boolean {
  // Check if task is already completed
  if (context.isTaskCompleted(task)) {
    return false;
  }

  // Check if task has unlock requirement
  if (!task.unlockRequirement) {
    return true; // No requirement, always available
  }

  // Check unlock requirement (sync version)
  return checkTaskRequirementSync(task.unlockRequirement, context, moduleData);
}

/**
 * Simplified sync check for task requirements
 * Note: This is a simplified version - full implementation would handle all requirement types
 */
function checkTaskRequirementSync(
  requirement: Task['unlockRequirement'],
  context: ModuleContext,
  moduleData: ModuleData
): boolean {
  if (!requirement) return true;

  switch (requirement.type) {
    case 'task-complete':
      return context.isTaskCompleted(requirement.task);
    case 'module-complete':
      return actions.isModuleCompleted(requirement.moduleId);
    case 'state-check':
      return context.getModuleStateField(requirement.key) === requirement.value;
    case 'and':
      return requirement.requirements.every(req => 
        checkTaskRequirementSync(req, context, moduleData)
      );
    case 'or':
      return requirement.requirements.some(req => 
        checkTaskRequirementSync(req, context, moduleData)
      );
    default:
      return false;
  }
}

/**
 * Get all available tasks
 */
export function getAvailableTasks(
  tasks: Task[],
  context: ModuleContext,
  moduleData: ModuleData
): Task[] {
  return tasks.filter(task => isTaskAvailable(task, context, moduleData));
}

/**
 * Get all active tasks (currently accepted)
 */
export function getActiveTasks(
  tasks: Task[],
  context: ModuleContext
): Task[] {
  const currentTaskId = context.getCurrentTaskId();
  if (!currentTaskId) return [];

  return tasks.filter(task => task.id === currentTaskId);
}
