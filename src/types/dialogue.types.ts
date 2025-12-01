/**
 * Dialogue Types
 * Types for the dialogue system
 * Depends on: ModuleState (core)
 */

import type { ModuleState } from './core/moduleState.types.js';
import type { DialogueChoice } from './choiceTypes.js';

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

