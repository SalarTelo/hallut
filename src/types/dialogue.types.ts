/**
 * Dialogue Types
 * Types for the dialogue system
 * Depends on: ModuleState (core)
 */

import type { ModuleState } from './core/moduleState.types.js';

/**
 * Dialogue completion action types
 */
export type DialogueCompletionAction =
  | { type: 'accept-task'; taskId: string }
  | { type: 'set-state'; key: string; value: unknown }
  | { type: 'function'; functionName: string };

/**
 * Dialogue choice option
 */
export interface DialogueChoice {
  /**
   * Choice text to display
   */
  text: string;

  /**
   * Action to perform when this choice is selected
   * If null, the dialogue will simply continue/end without performing any action
   */
  action: DialogueCompletionAction | DialogueCompletionAction[] | null;
}

/**
 * Dialogue configuration
 */
export interface DialogueConfig {
  /**
   * Dialogue ID
   */
  id: string;

  /**
   * Speaker ID (references an interactable)
   */
  speaker: string;

  /**
   * Greeting lines (shown when dialogue starts)
   */
  greeting: string[];

  /**
   * Choices to show at the end of dialogue
   * If not provided, a default "Continue" choice will be auto-generated
   * If a choice has action: null, it will just continue/end the dialogue
   */
  choices?: DialogueChoice[];

  /**
   * Optional action to perform when dialogue completes
   * Only used if choices are not provided (for backward compatibility)
   */
  onComplete?: DialogueCompletionAction | DialogueCompletionAction[];
}

/**
 * Dialogue context
 * Provided to dialogue handlers
 */
export interface DialogueContext {
  /**
   * Current module ID
   */
  moduleId: string;

  /**
   * Current locale
   */
  locale: string;

  /**
   * Current module state
   */
  moduleState: ModuleState;

  /**
   * Set a field in module state
   */
  setModuleStateField: <K extends keyof ModuleState>(
    key: K,
    value: ModuleState[K]
  ) => void;

  /**
   * Get a field from module state
   */
  getModuleStateField: <K extends keyof ModuleState>(key: K) => ModuleState[K] | undefined;
}

