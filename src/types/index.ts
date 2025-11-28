/**
 * Types Index
 * Central export point for all type definitions
 *
 * Organization:
 * - core/     - Low-level engine types (errors, progress, state)
 * - module/   - Module configuration and runtime types
 * - ui/       - UI component types
 * - Root      - Cross-cutting types (dialogue, interactable, worldmap)
 */

// Re-export from subdirectories
export * from './core/index.js';
export * from './module/index.js';
export * from './ui/index.js';

// Root-level types (cross-cutting concerns)

// Dialogue types
export type {
  DialogueCompletionAction,
  AcceptTaskAction,
  SetStateAction,
  FunctionAction,
} from './dialogue.types.js';

// Interactable types
export {
  InteractableActionType,
  taskComplete,
  moduleComplete,
  stateCheck,
  isTaskCompleteRequirement,
  isModuleCompleteRequirement,
  isStateCheckRequirement,
} from './interactable.types.js';

export type {
  UnlockRequirement,
  TaskCompleteRequirement,
  ModuleCompleteRequirement,
  StateCheckRequirement,
  InteractableAction,
  Interactable,
} from './interactable.types.js';

// Worldmap types
export type {
  WorldmapModule,
  WorldmapConfig,
} from './worldmap.types.js';

