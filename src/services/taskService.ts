/**
 * Task Service
 * Handles task evaluation and submission logic
 * Depends on: types only
 */

import type { TaskSubmission } from '../types/module/task.types.js';
import type { TaskSolveResult } from '../types/core/taskSolveResult.types.js';
import { handleError } from './errorService.js';
import { TaskError, ErrorCode } from '../types/core/error.types.js';

/**
 * Evaluate a task submission
 * Calls the task's solveFunction
 * 
 * @param solveFunction - Task's solve function
 * @param submission - User's submission
 * @returns Evaluation result
 */
export function evaluateTaskSubmission(
  solveFunction: (input: TaskSubmission) => TaskSolveResult,
  submission: TaskSubmission
): TaskSolveResult {
  try {
    return solveFunction(submission);
  } catch (error) {
    const taskError = new TaskError(
      ErrorCode.TASK_EVALUATION_ERROR,
      'unknown',
      error instanceof Error ? error.message : 'Unknown error occurred',
      undefined,
      { originalError: error }
    );
    handleError(taskError);
    return {
      solved: false,
      reason: 'evaluation_error',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Validate task submission format
 * Basic validation before evaluation
 * 
 * @param submission - User's submission
 * @param expectedType - Expected submission type
 * @returns True if valid
 */
export function validateTaskSubmission(
  submission: TaskSubmission,
  expectedType: string
): boolean {
  if (!submission || typeof submission !== 'object') {
    return false;
  }

  if (submission.type !== expectedType) {
    return false;
  }

  // Type-specific validation
  switch (submission.type) {
    case 'text':
      return typeof submission.text === 'string' && submission.text.trim().length > 0;
    case 'image':
      return submission.image !== undefined;
    case 'code':
      return typeof submission.code === 'string' && submission.code.trim().length > 0;
    case 'multiple_choice':
      return typeof submission.choice === 'string';
    case 'custom':
      return submission.data !== undefined;
    default:
      return true; // Allow custom types
  }
}

