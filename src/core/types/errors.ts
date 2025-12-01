/**
 * Error Types
 * Core error type definitions
 */

/**
 * Error codes
 */
export const ErrorCode = {
  MODULE_NOT_FOUND: 'MODULE_NOT_FOUND',
  MODULE_LOAD_FAILED: 'MODULE_LOAD_FAILED',
  MODULE_INVALID: 'MODULE_INVALID',
  MODULE_ALREADY_ACTIVE: 'MODULE_ALREADY_ACTIVE',
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  TASK_INVALID: 'TASK_INVALID',
  DIALOGUE_NOT_FOUND: 'DIALOGUE_NOT_FOUND',
  DIALOGUE_INVALID: 'DIALOGUE_INVALID',
  INTERACTABLE_NOT_FOUND: 'INTERACTABLE_NOT_FOUND',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

/**
 * Application error
 */
export class AppError extends Error {
  code: ErrorCode;
  context?: Record<string, unknown>;

  constructor(code: ErrorCode, context?: Record<string, unknown>) {
    super();
    this.name = 'AppError';
    this.code = code;
    this.context = context;
  }
}

/**
 * Module error
 */
export class ModuleError extends AppError {
  moduleId: string;

  constructor(code: ErrorCode, moduleId: string, message: string, context?: Record<string, unknown>) {
    super(code, { ...context, moduleId, message });
    this.name = 'ModuleError';
    this.message = message;
    this.moduleId = moduleId;
  }
}

/**
 * Task error
 */
export class TaskError extends AppError {
  taskId: string;
  moduleId?: string;

  constructor(code: ErrorCode, taskId: string, message: string, moduleId?: string, context?: Record<string, unknown>) {
    super(code, { ...context, taskId, moduleId, message });
    this.name = 'TaskError';
    this.message = message;
    this.taskId = taskId;
    this.moduleId = moduleId;
  }
}

/**
 * Dialogue error
 */
export class DialogueError extends AppError {
  dialogueId: string;
  moduleId?: string;

  constructor(code: ErrorCode, dialogueId: string, message: string, moduleId?: string, context?: Record<string, unknown>) {
    super(code, { ...context, dialogueId, moduleId, message });
    this.name = 'DialogueError';
    this.message = message;
    this.dialogueId = dialogueId;
    this.moduleId = moduleId;
  }
}

