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
  DialogueConfig,
  DialogueContext,
} from './dialogue.types.js';

// Interactable types
export {
  InteractableActionType,
  taskComplete,
  moduleComplete,
  stateCheck,
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
  WorldmapConfig,
} from './worldmap.types.js';

// Task types (type-safe)
export type {
  TextTaskSubmission,
  ImageTaskSubmission,
  CodeTaskSubmission,
  MultipleChoiceTaskSubmission,
  CustomTaskSubmission,
  TaskSubmission,
  TaskSubmissionConfig,
  TaskSolveFunction,
} from './taskTypes.js';

export {
  isTextSubmission,
  isImageSubmission,
  isCodeSubmission,
  isMultipleChoiceSubmission,
} from './taskTypes.js';

// Choice types (unified)
export type {
  ChoiceAction,
  DialogueChoice,
  ChoiceBuilder,
} from './choiceTypes.js';

// Interactable types (includes task sequence)
export type {
  Position,
  HandlerFunction,
  GetDialogueFunction,
  TaskSequence,
  TaskSequenceEntry,
} from './interactable.types.js';

