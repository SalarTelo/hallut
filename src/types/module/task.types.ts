/**
 * Task Types
 * Types for task submissions and configuration
 * Depends on: TaskSolveResult (core)
 */

import type { TaskSolveResult } from '../core/taskSolveResult.types.js';

/**
 * Task submission types
 * Union type allowing various submission formats
 */
export type TaskSubmission =
  | { type: 'text'; text: string }
  | { type: 'image'; image: File | string }
  | { type: 'code'; code: string }
  | { type: 'multiple_choice'; choice: string }
  | { type: 'custom'; data: unknown }
  | { type: string; [key: string]: unknown };

/**
 * Task submission type identifiers
 */
export type TaskSubmissionType =
  | 'text'
  | 'image'
  | 'code'
  | 'multiple_choice'
  | 'custom'
  | string;

/**
 * Task submission configuration
 * Defines how a task accepts submissions
 */
export interface TaskSubmissionConfig {
  /**
   * Type of submission expected
   */
  type: TaskSubmissionType;

  /**
   * Optional component name for custom submission UI
   */
  component?: string;

  /**
   * Optional configuration for the submission type
   * Extensible - modules can add their own config fields
   */
  config?: Record<string, unknown>;
}

/**
 * Task solve function signature
 * Modules provide this function to evaluate submissions
 */
export type TaskSolveFunction = (input: TaskSubmission) => TaskSolveResult;

