/**
 * Task Validation
 * Business logic for task validation
 */

import type { Task, TaskSubmission, TaskSolveResult } from './types/index.js';

/**
 * Validate a task submission
 */
export function validateTask(task: Task, submission: TaskSubmission): TaskSolveResult {
  return task.validate(submission);
}
