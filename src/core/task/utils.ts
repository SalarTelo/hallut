/**
 * Task Utilities
 * Helper functions for working with tasks
 */

import type { Task } from './types/index.js';

/**
 * Extract task ID from task (string or Task object)
 * Utility to handle both string IDs and Task objects consistently
 */
export function getTaskId(task: Task | string): string {
  return typeof task === 'string' ? task : task.id;
}
