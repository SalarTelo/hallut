/**
 * Task Solve Result
 * Core type for task evaluation results
 * No dependencies - foundation type
 */

/**
 * Result of evaluating a task submission
 */
export interface TaskSolveResult {
  /**
   * Whether the task was solved successfully
   */
  solved: boolean;

  /**
   * Reason for the result (e.g., "correct", "too_short", "missing_keywords")
   */
  reason: string;

  /**
   * Optional detailed explanation
   */
  details?: string;

  /**
   * Optional score (0-100)
   */
  score?: number;
}

