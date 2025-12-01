/**
 * Submission Component Registry
 * Registry for submission UI components with proper type safety
 */

import type { ComponentType } from 'react';
import type {
  TaskSubmissionConfig,
  TaskSubmission,
  TextTaskSubmission,
  ImageTaskSubmission,
  CodeTaskSubmission,
  MultipleChoiceTaskSubmission,
} from '../../../../types/taskTypes.js';

/**
 * Base props for submission components
 * Components should extend this with their specific submission type
 */
export interface SubmissionComponentProps<T extends TaskSubmission = TaskSubmission> {
  config: TaskSubmissionConfig<T>;
  value: T | null;
  onChange: (submission: T) => void;
  disabled?: boolean;
  error?: string | null;
}

/**
 * Type-safe component registry entry
 */
type SubmissionComponent = ComponentType<SubmissionComponentProps<any>>;

/**
 * Registry for submission UI components
 */
const submissionComponentRegistry = new Map<string, SubmissionComponent>();

/**
 * Register a submission UI component
 * 
 * @param type - Submission type identifier
 * @param component - React component to render
 */
export function registerSubmissionComponent<T extends TaskSubmission>(
  type: T['type'],
  component: ComponentType<SubmissionComponentProps<T>>
): void {
  submissionComponentRegistry.set(type, component as SubmissionComponent);
}

/**
 * Get submission component for a type
 * 
 * @param type - Submission type identifier
 * @returns Component or undefined if not registered
 */
export function getSubmissionComponent(
  type: string
): SubmissionComponent | undefined {
  return submissionComponentRegistry.get(type);
}

/**
 * Check if a submission type has a registered component
 * 
 * @param type - Submission type identifier
 * @returns True if component is registered
 */
export function hasSubmissionComponent(type: string): boolean {
  return submissionComponentRegistry.has(type);
}

