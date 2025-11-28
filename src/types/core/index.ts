/**
 * Core Types
 * Low-level type definitions used across the engine
 */

// Error types
export {
  ErrorCode,
  EngineError,
  ModuleError,
  TaskError,
  DialogueError,
  isEngineError,
  isModuleError,
  isTaskError,
  isDialogueError,
} from './error.types.js';

// Module class types (interfaces for module implementations)
export type {
  ModuleContext,
  InteractableFunctionResult,
  IModule,
} from './moduleClass.types.js';

// Module progress types (state tracking)
export type {
  ModuleProgress,
} from './moduleProgress.types.js';

// Module progression types (lifecycle states)
export type {
  ModuleProgressionState,
  ModuleProgression,
  ModuleProgressionMap,
} from './moduleProgression.types.js';

// Module state types (core state fields)
export {
  CORE_STATE_KEYS,
  defaultModuleState,
  isCoreStateKey,
} from './moduleState.types.js';

export type {
  ModuleState,
} from './moduleState.types.js';

// Task solve result types
export type {
  TaskSolveResult,
} from './taskSolveResult.types.js';
