/**
 * Task Types
 * Core task type definitions
 */

import type { UnlockRequirement } from '../unlock/types.js';

/**
 * Task submission types
 */
export type TaskSubmission =
  | { type: 'text'; text: string }
  | { type: 'image'; image: File | string }
  | { type: 'code'; code: string; language?: string }
  | { type: 'multiple_choice'; choice: string }
  | { type: 'custom'; data: unknown; component?: string };

/**
 * Task solve result
 */
export interface TaskSolveResult {
  solved: boolean;
  reason: string;
  details: string;
  score?: number;
}

/**
 * Task solve function
 */
export type TaskSolveFunction = (input: TaskSubmission) => TaskSolveResult;

/**
 * Task submission configuration
 */
export interface TaskSubmissionConfig {
  type: 'text' | 'image' | 'code' | 'multiple_choice' | 'custom';
  component?: string;
  config?: Record<string, unknown>;
}

/**
 * Task metadata for additional context (AI, UI, etc.)
 */
export interface TaskMeta {
  hints?: string[];      // AI guidance hints
  examples?: string[];   // Example solutions/approaches
  [key: string]: unknown; // Allow extension
}

/**
 * Task definition
 */
export interface Task {
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
  meta?: TaskMeta;
}
