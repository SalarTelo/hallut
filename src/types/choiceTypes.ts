/**
 * Type-Safe Choice Types
 * Simplified choice system with direct references
 */

import type { Task } from './module/moduleConfig.types.js';
import type { DialogueConfig } from './dialogue.types.js';
import type { ModuleContext } from './core/moduleClass.types.js';

/**
 * Choice action types with direct references
 */
export type ChoiceAction =
  | { type: 'accept-task'; task: Task }
  | { type: 'set-state'; key: string; value: unknown }
  | { type: 'call-function'; handler: (context: ModuleContext) => void | Promise<void> }
  | { type: 'go-to'; dialogue: DialogueConfig | null }
  | { type: 'none' };

/**
 * Simplified dialogue choice with direct references
 */
export interface DialogueChoice {
  /**
   * Choice text to display
   */
  text: string;

  /**
   * Action to perform when this choice is selected
   */
  action: ChoiceAction | ChoiceAction[] | null;
}

/**
 * Choice builder interface for method chaining
 */
export interface ChoiceBuilder {
  /**
   * Accept a task when this choice is selected
   */
  acceptTask(task: Task): ChoiceBuilder;

  /**
   * Set a state value when this choice is selected
   */
  setState(key: string, value: unknown): ChoiceBuilder;

  /**
   * Call a function handler when this choice is selected
   */
  callFunction(handler: (context: ModuleContext) => void | Promise<void>): ChoiceBuilder;

  /**
   * Navigate to another dialogue when this choice is selected
   */
  goTo(dialogue: DialogueConfig | null): ChoiceBuilder;

  /**
   * Build the final choice
   */
  build(): DialogueChoice;
}

