/**
 * Core Errors
 * Error types and utilities for the core system
 */

/**
 * Error codes
 */
export enum ErrorCode {
  MODULE_NOT_FOUND = 'MODULE_NOT_FOUND',
  MODULE_INVALID = 'MODULE_INVALID',
  MODULE_LOAD_ERROR = 'MODULE_LOAD_ERROR',
  TASK_NOT_FOUND = 'TASK_NOT_FOUND',
  TASK_INVALID = 'TASK_INVALID',
  DIALOGUE_INVALID = 'DIALOGUE_INVALID',
  DIALOGUE_NODE_NOT_FOUND = 'DIALOGUE_NODE_NOT_FOUND',
  UNLOCK_REQUIREMENT_NOT_MET = 'UNLOCK_REQUIREMENT_NOT_MET',
}

/**
 * Base application error
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Module-related error
 */
export class ModuleError extends AppError {
  constructor(
    code: ErrorCode,
    public moduleId: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(code, message, context);
    this.name = 'ModuleError';
  }
}

/**
 * Task-related error
 */
export class TaskError extends AppError {
  constructor(
    code: ErrorCode,
    public taskId: string,
    message: string,
    public moduleId?: string,
    context?: Record<string, unknown>
  ) {
    super(code, message, context);
    this.name = 'TaskError';
  }
}

/**
 * Dialogue-related error
 */
export class DialogueError extends AppError {
  constructor(
    code: ErrorCode,
    public dialogueId: string,
    message: string,
    public moduleId?: string,
    context?: Record<string, unknown>
  ) {
    super(code, message, context);
    this.name = 'DialogueError';
  }
}

/**
 * Extract error message from error (string or Error object)
 * Utility to handle both string errors and Error objects consistently
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
}
