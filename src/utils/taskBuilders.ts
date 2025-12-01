/**
 * Task Builder Helpers
 * Type-safe helpers for creating task configurations
 */

import type { Task } from '../types/module/moduleConfig.types.js';
import type { TaskSubmission, TaskSubmissionConfig, TaskSolveFunction } from '../types/module/task.types.js';
import type { TaskSolveResult } from '../types/core/taskSolveResult.types.js';

// ============================================================================
// Submission Config Builders
// ============================================================================

/**
 * Create a text submission configuration
 * 
 * @param config - Optional additional configuration
 * 
 * @example
 * submission: textSubmission()
 * submission: textSubmission({ minLength: 200 })
 */
export function textSubmission(config?: Record<string, unknown>): TaskSubmissionConfig {
  return {
    type: 'text',
    config,
  };
}

/**
 * Create an image submission configuration
 * 
 * @param config - Optional additional configuration
 * 
 * @example
 * submission: imageSubmission()
 */
export function imageSubmission(config?: Record<string, unknown>): TaskSubmissionConfig {
  return {
    type: 'image',
    config,
  };
}

/**
 * Create a code submission configuration
 * 
 * @param language - Programming language
 * @param config - Optional additional configuration
 * 
 * @example
 * submission: codeSubmission('javascript')
 */
export function codeSubmission(
  language?: string,
  config?: Record<string, unknown>
): TaskSubmissionConfig {
  return {
    type: 'code',
    config: { language, ...config },
  };
}

/**
 * Create a multiple choice submission configuration
 * 
 * @param options - Available choices
 * @param config - Optional additional configuration
 * 
 * @example
 * submission: multipleChoiceSubmission(['Option A', 'Option B', 'Option C'])
 */
export function multipleChoiceSubmission(
  options: string[],
  config?: Record<string, unknown>
): TaskSubmissionConfig {
  return {
    type: 'multiple_choice',
    config: { options, ...config },
  };
}

/**
 * Create a custom submission configuration
 * 
 * @param component - Component name to render
 * @param config - Optional additional configuration
 * 
 * @example
 * submission: customSubmission('MyCustomForm')
 */
export function customSubmission(
  component: string,
  config?: Record<string, unknown>
): TaskSubmissionConfig {
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
 * 
 * @param reason - Short reason code
 * @param details - Human-readable details
 * @param score - Optional score (0-100)
 * 
 * @example
 * return success('complete', 'Great work!', 100);
 */
export function success(
  reason: string,
  details: string,
  score?: number
): TaskSolveResult {
  return {
    solved: true,
    reason,
    details,
    score,
  };
}

/**
 * Create a failed solve result
 * 
 * @param reason - Short reason code
 * @param details - Human-readable details
 * 
 * @example
 * return failure('too_short', 'Your answer needs to be longer.');
 */
export function failure(reason: string, details: string): TaskSolveResult {
  return {
    solved: false,
    reason,
    details,
  };
}

// ============================================================================
// Common Validation Helpers
// ============================================================================

/**
 * Get text from a submission, handling different submission types
 * 
 * @param input - Task submission
 * @returns Text content or null if not a text submission
 */
export function getTextFromSubmission(input: TaskSubmission): string | null {
  if (input.type === 'text' && 'text' in input) {
    return (input.text as string).trim();
  }
  return null;
}

/**
 * Create a solve function that validates text length
 * 
 * @param minLength - Minimum required length
 * @param onValid - Callback when text is valid, returns solve result
 * 
 * @example
 * solveFunction: textLengthValidator(200, (text) => {
 *   if (text.includes('required-word')) {
 *     return success('complete', 'Well done!');
 *   }
 *   return failure('missing_content', 'Include the required word.');
 * })
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
 * 
 * @param minWords - Minimum required word count
 * @param onValid - Callback when word count is valid
 * 
 * @example
 * solveFunction: wordCountValidator(50, (text, wordCount) => {
 *   return success('complete', `Great! You wrote ${wordCount} words.`);
 * })
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
 * 
 * @param keywords - Required keywords (case-insensitive)
 * @param onValid - Callback when all keywords are present
 * 
 * @example
 * solveFunction: keywordsValidator(['dragon', 'castle'], (text) => {
 *   return success('complete', 'You included all the key elements!');
 * })
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
 * Runs validators in order, returns first failure or final success
 * 
 * @param validators - Array of validator functions
 * 
 * @example
 * solveFunction: combineValidators([
 *   textLengthValidator(100, () => success('length_ok', '')),
 *   keywordsValidator(['dragon'], () => success('complete', 'Well done!'))
 * ])
 */
export function combineValidators(
  validators: TaskSolveFunction[]
): TaskSolveFunction {
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
  /** Task display name */
  name: string;
  /** Task description */
  description: string;
  /** Submission configuration */
  submission: TaskSubmissionConfig;
  /** Solve function to validate submissions */
  solve: TaskSolveFunction;
  /** Optional task overview */
  overview?: {
    requirements?: string;
    goals?: string[];
  };
  /** Optional dialogue shown when task is offered */
  offerDialogue?: {
    lines: string[];
    acceptText?: string;
  };
  /** Optional dialogue shown when task is active */
  activeDialogue?: {
    lines: string[];
    readyText?: string;
    notReadyText?: string;
  };
}

/**
 * Create a task definition
 * 
 * @param id - Unique task ID
 * @param options - Task configuration
 * @returns Task object
 * 
 * @example
 * const storyTask = createTask('task-1', {
 *   name: 'Write a Story',
 *   description: 'Create a short story about adventure.',
 *   submission: textSubmission(),
 *   solve: textLengthValidator(200, (text) => {
 *     if (text.includes('adventure')) {
 *       return success('complete', 'Great story!', 100);
 *     }
 *     return failure('missing_theme', 'Include the theme of adventure.');
 *   }),
 *   overview: {
 *     requirements: 'Write at least 200 characters about adventure.',
 *     goals: ['Include adventure theme', 'Create engaging narrative']
 *   }
 * });
 */
export function createTask(id: string, options: TaskOptions): Task {
  const {
    name,
    description,
    submission,
    solve,
    overview,
    offerDialogue,
    activeDialogue,
  } = options;

  const task: Task = {
    id,
    name,
    description,
    solveFunction: solve,
    submission,
  };

  if (overview) {
    task.overview = overview;
  }

  if (offerDialogue) {
    task.offerDialogue = offerDialogue;
  }

  if (activeDialogue) {
    task.activeDialogue = activeDialogue;
  }

  return task;
}

/**
 * Create a simple text task with length validation
 * 
 * @param id - Task ID
 * @param name - Task name
 * @param description - Task description
 * @param minLength - Minimum text length
 * @param successMessage - Message shown on success
 * 
 * @example
 * const task = simpleTextTask(
 *   'task-1',
 *   'Write Your Story',
 *   'Write a creative story.',
 *   200,
 *   'Great story!'
 * );
 */
export function simpleTextTask(
  id: string,
  name: string,
  description: string,
  minLength: number,
  successMessage: string
): Task {
  return createTask(id, {
    name,
    description,
    submission: textSubmission(),
    solve: textLengthValidator(minLength, () => success('complete', successMessage, 100)),
    overview: {
      requirements: `Write at least ${minLength} characters.`,
    },
  });
}




