/**
 * Error Service
 * Centralized error handling and logging
 */

import type { EngineError, ModuleError, TaskError, DialogueError } from '../types/core/error.types.js';
import { isEngineError, isModuleError, isTaskError, isDialogueError } from '../types/core/error.types.js';

/**
 * Error handler callback type
 */
export type ErrorHandler = (error: Error) => void;

/**
 * Global error handlers
 */
const errorHandlers: ErrorHandler[] = [];

/**
 * Register an error handler
 * 
 * @param handler - Error handler function
 * @returns Unregister function
 */
export function registerErrorHandler(handler: ErrorHandler): () => void {
  errorHandlers.push(handler);
  return () => {
    const index = errorHandlers.indexOf(handler);
    if (index > -1) {
      errorHandlers.splice(index, 1);
    }
  };
}

/**
 * Handle an error
 * Logs the error and calls all registered handlers
 * 
 * @param error - Error to handle
 * @param context - Additional context
 */
export function handleError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Add context to error if it's an EngineError
  if (isEngineError(errorObj) && context) {
    errorObj.context = { ...errorObj.context, ...context };
  }

  // Log error
  if (isModuleError(errorObj)) {
    console.error(`[ModuleError:${errorObj.moduleId}] ${errorObj.message}`, errorObj.context);
  } else if (isTaskError(errorObj)) {
    console.error(`[TaskError:${errorObj.taskId}] ${errorObj.message}`, errorObj.context);
  } else if (isDialogueError(errorObj)) {
    console.error(`[DialogueError:${errorObj.dialogueId}] ${errorObj.message}`, errorObj.context);
  } else if (isEngineError(errorObj)) {
    console.error(`[EngineError:${errorObj.code}] ${errorObj.message}`, errorObj.context);
  } else {
    console.error('[Error]', errorObj);
  }

  // Call all registered handlers
  for (const handler of errorHandlers) {
    try {
      handler(errorObj);
    } catch (handlerError) {
      // Don't let handler errors break the error handling chain
      console.error('Error in error handler:', handlerError);
    }
  }
}

/**
 * Create a user-friendly error message
 * 
 * @param error - Error to format
 * @returns User-friendly message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (isEngineError(error)) {
    switch (error.code) {
      case 'MODULE_NOT_FOUND':
        return 'Module not found. Please try selecting a different module.';
      case 'MODULE_LOAD_FAILED':
        return 'Failed to load module. Please try again later.';
      case 'MODULE_INVALID':
        return 'Module configuration is invalid.';
      case 'TASK_NOT_FOUND':
        return 'Task not found.';
      case 'TASK_EVALUATION_ERROR':
        return 'Error evaluating task. Please try again.';
      case 'DIALOGUE_NOT_FOUND':
        return 'Dialogue not found.';
      case 'STATE_ACCESS_ERROR':
        return 'Error accessing module state.';
      default:
        return error.message || 'An error occurred.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
}

