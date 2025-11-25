/**
 * Unified task evaluation service
 * Single source of truth for task evaluation
 */

import type { Task, TaskSolveResult } from '../types/module.types.js';
import type { TaskSubmission } from '../types/task.types.js';

/**
 * Evaluate a task submission
 */
export async function evaluateTask(
  task: Task,
  submission: TaskSubmission
): Promise<TaskSolveResult> {
  // Always use the task's solveFunction
  // This is the single source of truth
  const result = task.solveFunction(submission);
  
  return result;
}

/**
 * Validate task submission before evaluation
 */
export function validateSubmission(
  task: Task,
  submission: TaskSubmission
): { valid: boolean; error?: string } {
  // Basic validation based on submission type
  if (submission.type !== task.submission.type) {
    return {
      valid: false,
      error: `Expected submission type ${task.submission.type}, got ${submission.type}`,
    };
  }
  
  // Type-specific validation
  if (submission.type === 'text') {
    const minLength = task.submission.config?.minLength;
    if (minLength && submission.text.length < minLength) {
      return {
        valid: false,
        error: `Text must be at least ${minLength} characters`,
      };
    }
  }
  
  if (submission.type === 'image') {
    const maxSize = task.submission.config?.maxFileSize;
    if (submission.image instanceof File && maxSize && submission.image.size > maxSize) {
      return {
        valid: false,
        error: `Image must be smaller than ${maxSize} bytes`,
      };
    }
    
    const allowedFormats = task.submission.config?.allowedFormats;
    if (allowedFormats && submission.image instanceof File) {
      const ext = submission.image.name.split('.').pop()?.toLowerCase();
      if (!ext || !allowedFormats.includes(ext)) {
        return {
          valid: false,
          error: `Image format must be one of: ${allowedFormats.join(', ')}`,
        };
      }
    }
  }
  
  return { valid: true };
}

