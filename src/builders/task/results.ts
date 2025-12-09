/**
 * Task Result Builders
 * Functions for creating task solve results
 */

import type { TaskSolveResult } from '@core/task/types.js';

/**
 * Create a successful solve result
 */
export function success(reason: string, details: string, score?: number): TaskSolveResult {
  return {
    solved: true,
    reason,
    details,
    score,
  };
}

/**
 * Create a failed solve result
 */
export function failure(reason: string, details: string): TaskSolveResult {
  return {
    solved: false,
    reason,
    details,
  };
}

