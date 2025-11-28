/**
 * Feltyper
 * Centraliserade feltypsdefinitioner för motorn
 * Inga beroenden - grundläggande typ
 */

/**
 * Felkoder för olika feltyper
 * Använder const-objekt istället för enum för erasableSyntaxOnly-kompatibilitet
 */
export const ErrorCode = {
  // Modulfel
  MODULE_NOT_FOUND: 'MODULE_NOT_FOUND',
  MODULE_LOAD_FAILED: 'MODULE_LOAD_FAILED',
  MODULE_INVALID: 'MODULE_INVALID',
  MODULE_ALREADY_ACTIVE: 'MODULE_ALREADY_ACTIVE',
  
  // Uppgiftsfel
  TASK_NOT_FOUND: 'TASK_NOT_FOUND',
  TASK_EVALUATION_ERROR: 'TASK_EVALUATION_ERROR',
  TASK_INVALID_SUBMISSION: 'TASK_INVALID_SUBMISSION',
  
  // Dialogfel
  DIALOGUE_NOT_FOUND: 'DIALOGUE_NOT_FOUND',
  DIALOGUE_INVALID: 'DIALOGUE_INVALID',
  
  // Statusfel
  STATE_ACCESS_ERROR: 'STATE_ACCESS_ERROR',
  STATE_UPDATE_ERROR: 'STATE_UPDATE_ERROR',
  
  // Generella fel
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

/**
 * Felkodstyp
 */
export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

/**
 * Basfelklass för motorfel
 */
export class EngineError extends Error {
  public readonly code: ErrorCode;
  public readonly context?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'EngineError';
    this.code = code;
    this.context = context;
    
    // Bibehåller korrekt stack trace för var felet kastades (endast tillgängligt i V8/Node.js)
    const ErrorConstructor = Error as unknown as { captureStackTrace?: (error: Error, constructor: typeof EngineError) => void };
    if (typeof ErrorConstructor.captureStackTrace === 'function') {
      ErrorConstructor.captureStackTrace(this, EngineError);
    }
  }
}

/**
 * Modulspecifikt fel
 */
export class ModuleError extends EngineError {
  public readonly moduleId: string;

  constructor(
    code: ErrorCode,
    moduleId: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(code, message, { ...context, moduleId });
    this.name = 'ModuleError';
    this.moduleId = moduleId;
  }
}

/**
 * Uppgiftsspecifikt fel
 */
export class TaskError extends EngineError {
  public readonly taskId: string;
  public readonly moduleId?: string;

  constructor(
    code: ErrorCode,
    taskId: string,
    message: string,
    moduleId?: string,
    context?: Record<string, unknown>
  ) {
    super(code, message, { ...context, taskId, moduleId });
    this.name = 'TaskError';
    this.taskId = taskId;
    this.moduleId = moduleId;
  }
}

/**
 * Dialogspecifikt fel
 */
export class DialogueError extends EngineError {
  public readonly dialogueId: string;
  public readonly moduleId?: string;

  constructor(
    code: ErrorCode,
    dialogueId: string,
    message: string,
    moduleId?: string,
    context?: Record<string, unknown>
  ) {
    super(code, message, { ...context, dialogueId, moduleId });
    this.name = 'DialogueError';
    this.dialogueId = dialogueId;
    this.moduleId = moduleId;
  }
}

/**
 * Typvakt för att kontrollera om ett fel är ett EngineError
 * 
 * @param error - Fel att kontrollera
 * @returns Sant om felet är ett EngineError
 */
export function isEngineError(error: unknown): error is EngineError {
  return error instanceof EngineError;
}

/**
 * Typvakt för att kontrollera om ett fel är ett ModuleError
 * 
 * @param error - Fel att kontrollera
 * @returns Sant om felet är ett ModuleError
 */
export function isModuleError(error: unknown): error is ModuleError {
  return error instanceof ModuleError;
}

/**
 * Typvakt för att kontrollera om ett fel är ett TaskError
 * 
 * @param error - Fel att kontrollera
 * @returns Sant om felet är ett TaskError
 */
export function isTaskError(error: unknown): error is TaskError {
  return error instanceof TaskError;
}

/**
 * Typvakt för att kontrollera om ett fel är ett DialogueError
 * 
 * @param error - Fel att kontrollera
 * @returns Sant om felet är ett DialogueError
 */
export function isDialogueError(error: unknown): error is DialogueError {
  return error instanceof DialogueError;
}
