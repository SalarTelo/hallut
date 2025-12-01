/**
 * Type-Safe Task Types
 * Type-safe task submission types with generics for compile-time safety
 */

import type { TaskSolveResult } from './core/taskSolveResult.types.js';

/**
 * Text task submission
 */
export interface TextTaskSubmission {
  type: 'text';
  text: string;
}

/**
 * Image task submission
 */
export interface ImageTaskSubmission {
  type: 'image';
  image: File | string; // File for upload, string for URL
}

/**
 * Code task submission
 */
export interface CodeTaskSubmission {
  type: 'code';
  code: string;
  language?: string;
}

/**
 * Multiple choice task submission
 */
export interface MultipleChoiceTaskSubmission {
  type: 'multiple_choice';
  choice: string;
}

/**
 * Custom task submission (extensible)
 */
export interface CustomTaskSubmission<T = unknown> {
  type: string; // Custom type identifier
  data: T;
}

/**
 * Union type for all task submissions
 */
export type TaskSubmission = 
  | TextTaskSubmission
  | ImageTaskSubmission
  | CodeTaskSubmission
  | MultipleChoiceTaskSubmission
  | CustomTaskSubmission<unknown>;

/**
 * Type-safe task submission config
 */
export interface TaskSubmissionConfig<T extends TaskSubmission = TaskSubmission> {
  type: T['type'];
  component?: string; // Custom UI component name
  config?: Record<string, unknown>; // Type-specific config
}

/**
 * Type-safe solve function
 */
export type TaskSolveFunction<T extends TaskSubmission = TaskSubmission> = (
  input: T
) => TaskSolveResult | Promise<TaskSolveResult>;

/**
 * Type guards for runtime safety
 */

/**
 * Type guard for text submission
 */
export function isTextSubmission(
  submission: TaskSubmission
): submission is TextTaskSubmission {
  return submission.type === 'text' && 'text' in submission;
}

/**
 * Type guard for image submission
 */
export function isImageSubmission(
  submission: TaskSubmission
): submission is ImageTaskSubmission {
  return submission.type === 'image' && 'image' in submission;
}

/**
 * Type guard for code submission
 */
export function isCodeSubmission(
  submission: TaskSubmission
): submission is CodeTaskSubmission {
  return submission.type === 'code' && 'code' in submission;
}

/**
 * Type guard for multiple choice submission
 */
export function isMultipleChoiceSubmission(
  submission: TaskSubmission
): submission is MultipleChoiceTaskSubmission {
  return submission.type === 'multiple_choice' && 'choice' in submission;
}

