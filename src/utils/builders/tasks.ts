/**
 * Task Builders
 * Type-safe builders for creating tasks
 */

import type { Task, TaskSubmission, TaskSubmissionConfig, TaskSolveFunction, TaskSolveResult } from '@core/types/task.js';
import type { UnlockRequirement } from '@core/types/unlock.js';

// ============================================================================
// Submission Config Builders
// ============================================================================

/**
 * Create a text submission configuration
 */
export function textSubmission(config?: Record<string, unknown>): TaskSubmissionConfig {
  return {
    type: 'text',
    config,
  };
}

/**
 * Create an image submission configuration
 */
export function imageSubmission(config?: Record<string, unknown>): TaskSubmissionConfig {
  return {
    type: 'image',
    config,
  };
}

/**
 * Create a code submission configuration
 */
export function codeSubmission(language?: string, config?: Record<string, unknown>): TaskSubmissionConfig {
  return {
    type: 'code',
    config: { language, ...config },
  };
}

/**
 * Create a multiple choice submission configuration
 */
export function multipleChoiceSubmission(options: string[], config?: Record<string, unknown>): TaskSubmissionConfig {
  return {
    type: 'multiple_choice',
    config: { options, ...config },
  };
}

/**
 * Create a custom submission configuration
 */
export function customSubmission(component: string, config?: Record<string, unknown>): TaskSubmissionConfig {
  return {
    type: 'custom',
    component,
    config,
  };
}

// ============================================================================
// Solve Result Builders
// ============================================================================

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

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Get text from a submission
 */
export function getTextFromSubmission(input: TaskSubmission): string | null {
  if (input.type === 'text' && 'text' in input) {
    return (input.text as string).trim();
  }
  return null;
}

/**
 * Create a solve function that validates text length
 */
export function textLengthValidator(
  minLength: number,
  onValid: (text: string) => TaskSolveResult
): TaskSolveFunction {
  return (input: TaskSubmission): TaskSolveResult => {
    const text = getTextFromSubmission(input);
    
    if (text === null) {
      return failure('invalid_submission', 'Please submit your answer as text.');
    }

    if (text.length < minLength) {
      return failure(
        'too_short',
        `Your answer is too short. Minimum length: ${minLength} characters. Current: ${text.length} characters.`
      );
    }

    return onValid(text);
  };
}

/**
 * Create a solve function that validates word count
 */
export function wordCountValidator(
  minWords: number,
  onValid: (text: string, wordCount: number) => TaskSolveResult
): TaskSolveFunction {
  return (input: TaskSubmission): TaskSolveResult => {
    const text = getTextFromSubmission(input);
    
    if (text === null) {
      return failure('invalid_submission', 'Please submit your answer as text.');
    }

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    if (wordCount < minWords) {
      return failure(
        'too_short',
        `Your answer needs more words. Minimum: ${minWords} words. Current: ${wordCount} words.`
      );
    }

    return onValid(text, wordCount);
  };
}

/**
 * Create a solve function that requires certain keywords
 */
export function keywordsValidator(
  keywords: string[],
  onValid: (text: string, foundKeywords: string[]) => TaskSolveResult
): TaskSolveFunction {
  return (input: TaskSubmission): TaskSolveResult => {
    const text = getTextFromSubmission(input);
    
    if (text === null) {
      return failure('invalid_submission', 'Please submit your answer as text.');
    }

    const lowerText = text.toLowerCase();
    const foundKeywords = keywords.filter(kw => lowerText.includes(kw.toLowerCase()));
    const missingKeywords = keywords.filter(kw => !lowerText.includes(kw.toLowerCase()));

    if (missingKeywords.length > 0) {
      const missingText = missingKeywords.map(kw => `"${kw}"`).join(', ');
      return failure(
        'missing_keywords',
        `Your answer is missing required elements: ${missingText}`
      );
    }

    return onValid(text, foundKeywords);
  };
}

/**
 * Combine multiple validators
 */
export function combineValidators(validators: TaskSolveFunction[]): TaskSolveFunction {
  return (input: TaskSubmission): TaskSolveResult => {
    for (const validator of validators) {
      const result = validator(input);
      if (!result.solved) {
        return result;
      }
    }
    // Return the last successful result
    return validators[validators.length - 1](input);
  };
}

// ============================================================================
// Task Builder
// ============================================================================

/**
 * Task creation options
 */
export interface TaskOptions {
  id: string;
  name: string;
  description: string;
  submission: TaskSubmissionConfig;
  validate: TaskSolveFunction;
  overview?: {
    requirements?: string;
    goals?: string[];
  };
  unlockRequirement?: UnlockRequirement | null;
  dialogues?: {
    offer?: string[];
    ready?: string[];
    complete?: string[];
  };
}

/**
 * Create a task definition
 */
export function createTask(options: TaskOptions): Task {
  const { id, name, description, submission, validate, overview, unlockRequirement, dialogues } = options;

  const task: Task = {
    id,
    name,
    description,
    submission,
    validate,
  };

  if (overview) {
    task.overview = overview;
  }

  if (unlockRequirement !== undefined) {
    task.unlockRequirement = unlockRequirement;
  }

  if (dialogues) {
    task.dialogues = dialogues;
  }

  return task;
}

