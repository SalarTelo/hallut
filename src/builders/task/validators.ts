/**
 * Task Validator Builders
 * Functions for creating task validation functions
 */

import type { TaskSubmission, TaskSolveFunction, TaskSolveResult } from '@core/task/types.js';
import { getTextFromSubmission } from './utils.js';
import { failure } from './results.js';

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

