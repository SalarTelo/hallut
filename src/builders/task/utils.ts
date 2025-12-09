/**
 * Task Builder Utilities
 * Helper functions for task builders
 */

import type { TaskSubmission } from '@core/task/types.js';

/**
 * Get text from a submission
 */
export function getTextFromSubmission(input: TaskSubmission): string | null {
  if (input.type === 'text' && 'text' in input) {
    return (input.text as string).trim();
  }
  return null;
}

