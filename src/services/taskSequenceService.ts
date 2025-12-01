/**
 * Task Sequence Service
 * Handles task sequencing and progression logic
 */

import type {
  TaskSequence,
  TaskSequenceEntry,
  Interactable,
} from '../types/interactable.types.js';
import type { Task } from '../types/module/moduleConfig.types.js';
import type { ModuleContext } from '../types/core/moduleClass.types.js';

/**
 * Get the next available task based on sequence and completion state
 * 
 * @param taskSequence - Task sequence definition
 * @param context - Module context
 * @returns Next available task or null
 */
export function getNextAvailableTask(
  taskSequence: TaskSequence,
  context: ModuleContext
): Task | null {
  for (const entry of taskSequence.entries) {
    // Skip if already completed
    if (context.isTaskCompleted(entry.task)) {
      continue;
    }

    // Skip if currently active
    const currentTask = context.getCurrentTask();
    if (currentTask?.id === entry.task.id) {
      continue;
    }

    // Check prerequisites
    if (entry.after && entry.after.length > 0) {
      const allPrerequisitesMet = entry.after.every((prereq) =>
        context.isTaskCompleted(prereq)
      );
      if (!allPrerequisitesMet) {
        continue;
      }
    }

    // This task is available
    return entry.task;
  }

  return null;
}

/**
 * Get which interactable should offer a specific task
 * 
 * @param taskSequence - Task sequence definition
 * @param taskId - Task ID
 * @returns Interactable that offers this task, or null
 */
export function getTaskOfferedBy(
  taskSequence: TaskSequence,
  taskId: string
): Interactable | null {
  for (const entry of taskSequence.entries) {
    if (entry.task.id === taskId) {
      return entry.offeredBy;
    }
  }
  return null;
}

/**
 * Check if a task can be offered (prerequisites met)
 * 
 * @param taskSequence - Task sequence definition
 * @param taskId - Task ID
 * @param context - Module context
 * @returns True if task can be offered
 */
export function canOfferTask(
  taskSequence: TaskSequence,
  taskId: string,
  context: ModuleContext
): boolean {
  const entry = taskSequence.entries.find((e) => e.task.id === taskId);
  if (!entry) {
    return false;
  }

  // Cannot offer if already completed
  if (context.isTaskCompleted(entry.task)) {
    return false;
  }

  // Check prerequisites - all must be completed
  if (entry.after && entry.after.length > 0) {
    return entry.after.every((prereq) => context.isTaskCompleted(prereq));
  }

  // No prerequisites - can be offered
  return true;
}

/**
 * Get interactables to unlock when a task completes
 * 
 * @param taskSequence - Task sequence definition
 * @param taskId - Completed task ID
 * @returns Array of interactables to unlock
 */
export function getUnlocksForTask(
  taskSequence: TaskSequence,
  taskId: string
): Interactable[] {
  const entry = taskSequence.entries.find((e) => e.task.id === taskId);
  return entry?.unlocks || [];
}

