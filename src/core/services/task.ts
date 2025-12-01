/**
 * Task Service
 * Business logic for task validation
 */

import type { Task, TaskSubmission, TaskSolveResult } from '../types/task.js';

/**
 * Validate a task submission
 */
export function validateTask(task: Task, submission: TaskSubmission): TaskSolveResult {
  return task.validate(submission);
}

