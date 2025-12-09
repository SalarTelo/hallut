/**
 * Task Submission Builders
 * Functions for creating task submission configurations
 */

import type { TaskSubmissionConfig } from '@core/task/types.js';

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

