/**
 * Type-Safe Task Builders
 * Builders for creating type-safe tasks with direct references
 */

import type { Task } from '../types/module/moduleConfig.types.js';
import type {
  TextTaskSubmission,
  ImageTaskSubmission,
  CodeTaskSubmission,
  MultipleChoiceTaskSubmission,
  TaskSubmission,
  TaskSubmissionConfig,
  TaskSolveFunction,
} from '../types/taskTypes.js';
import type { TaskSolveResult } from '../types/core/taskSolveResult.types.js';
import { success, failure } from './taskBuilders.js';

// ============================================================================
// Submission Config Builders
// ============================================================================

/**
 * Text submission config
 */
export interface TextSubmissionConfig extends TaskSubmissionConfig<TextTaskSubmission> {
  type: 'text';
  config?: {
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    multiline?: boolean;
  };
}

/**
 * Image submission config
 */
export interface ImageSubmissionConfig extends TaskSubmissionConfig<ImageTaskSubmission> {
  type: 'image';
  config?: {
    maxSize?: number; // bytes
    acceptedFormats?: string[]; // ['image/png', 'image/jpeg']
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
}

/**
 * Code submission config
 */
export interface CodeSubmissionConfig extends TaskSubmissionConfig<CodeTaskSubmission> {
  type: 'code';
  config?: {
    language?: string;
    theme?: string;
    minLines?: number;
    maxLines?: number;
  };
}

/**
 * Multiple choice submission config
 */
export interface MultipleChoiceSubmissionConfig
  extends TaskSubmissionConfig<MultipleChoiceTaskSubmission> {
  type: 'multiple_choice';
  config?: {
    options: string[];
    allowMultiple?: boolean;
  };
}

/**
 * Create text submission config
 */
export function textSubmission(
  config?: TextSubmissionConfig['config']
): TextSubmissionConfig {
  return {
    type: 'text',
    config,
  };
}

/**
 * Create image submission config
 */
export function imageSubmission(
  config?: ImageSubmissionConfig['config']
): ImageSubmissionConfig {
  return {
    type: 'image',
    config,
  };
}

/**
 * Create code submission config
 */
export function codeSubmission(
  language?: string,
  config?: Omit<CodeSubmissionConfig['config'], 'language'>
): CodeSubmissionConfig {
  return {
    type: 'code',
    config: { language, ...config },
  };
}

/**
 * Create multiple choice submission config
 */
export function multipleChoiceSubmission(
  options: string[],
  config?: Omit<MultipleChoiceSubmissionConfig['config'], 'options'>
): MultipleChoiceSubmissionConfig {
  return {
    type: 'multiple_choice',
    config: { options, ...config },
  };
}

// ============================================================================
// Type-Safe Validators
// ============================================================================

/**
 * Type-safe text validator
 */
export function createTextTaskValidator(
  validator: (text: string) => TaskSolveResult
): TaskSolveFunction<TextTaskSubmission> {
  return (input: TextTaskSubmission): TaskSolveResult => {
    if (input.type !== 'text') {
      return failure('invalid_type', 'Expected text submission');
    }
    return validator(input.text);
  };
}

/**
 * Type-safe image validator
 */
export function createImageTaskValidator(
  validator: (image: File | string) => TaskSolveResult | Promise<TaskSolveResult>
): TaskSolveFunction<ImageTaskSubmission> {
  return (input: ImageTaskSubmission): TaskSolveResult | Promise<TaskSolveResult> => {
    if (input.type !== 'image') {
      return failure('invalid_type', 'Expected image submission');
    }
    return validator(input.image);
  };
}

/**
 * Type-safe code validator
 */
export function createCodeTaskValidator(
  validator: (code: string, language?: string) => TaskSolveResult
): TaskSolveFunction<CodeTaskSubmission> {
  return (input: CodeTaskSubmission): TaskSolveResult => {
    if (input.type !== 'code') {
      return failure('invalid_type', 'Expected code submission');
    }
    return validator(input.code, input.language);
  };
}

// ============================================================================
// Type-Safe Task Builder
// ============================================================================

/**
 * Type-safe task options
 */
export interface TypeSafeTaskOptions<T extends TaskSubmission = TaskSubmission> {
  id: string;
  name: string;
  description: string;
  submission: TaskSubmissionConfig<T>;
  solve: TaskSolveFunction<T>;
  overview?: {
    requirements?: string;
    goals?: string[];
  };
}

/**
 * Create a type-safe task
 * Uses type-safe types directly - no conversion needed
 */
export function createTypeSafeTask<T extends TaskSubmission>(
  options: TypeSafeTaskOptions<T>
): Task {
  // Create a wrapper function that validates the input type
  const solveFunction: import('../types/taskTypes.js').TaskSolveFunction = (
    input: import('../types/taskTypes.js').TaskSubmission
  ): TaskSolveResult | Promise<TaskSolveResult> => {
    // Type guard: ensure input matches expected type
    if (input.type !== options.submission.type) {
      return failure('invalid_type', `Expected ${options.submission.type} submission`);
    }
    // Cast to expected type and call type-safe solve function
    return options.solve(input as T);
  };

  return {
    id: options.id,
    name: options.name,
    description: options.description,
    submission: options.submission, // Use directly - no conversion needed
    solveFunction, // Wrapped to handle type validation
    overview: options.overview,
  };
}

// Re-export success and failure for convenience
export { success, failure };

