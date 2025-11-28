/**
 * Module Class Interface
 * Defines the interface that all modules must implement
 * Depends on: ModuleConfig (will be defined in module types)
 */

import type { ModuleConfig } from '../module/moduleConfig.types.js';
import type { DialogueCompletionAction } from '../dialogue.types.js';

/**
 * Context provided to modules by the engine
 */
export interface ModuleContext {
  /**
   * Current module ID
   */
  moduleId: string;

  /**
   * Current locale
   */
  locale: string;

  /**
   * Set a field in module-specific state
   */
  setModuleStateField: (key: string, value: unknown) => void;

  /**
   * Get a field from module-specific state
   */
  getModuleStateField: (key: string) => unknown;

  /**
   * Accept a task
   */
  acceptTask: (taskId: string) => void;

  /**
   * Complete a task
   */
  completeTask: (taskId: string) => void;

  /**
   * Check if a task is completed
   */
  isTaskCompleted: (taskId: string) => boolean;

  /**
   * Get current active task ID
   */
  getCurrentTaskId: () => string | null;

  /**
   * Open task submission view for a task
   */
  openTaskSubmission?: (taskId: string) => void;
}

/**
 * Function handler result for interactable function actions
 */
export type InteractableFunctionResult =
  | { type: 'dialogue'; dialogueId: string }
  | { type: 'task'; taskId: string }
  | { type: 'none' };

/**
 * Module class interface
 * All modules must implement this interface
 */
export interface IModule {
  /**
   * Initialize the module and return its configuration
   * Called when the module is first loaded
   */
  init(locale: string): ModuleConfig;

  /**
   * Run the module
   * Called when the module starts
   * Optional - modules can implement this for setup logic
   */
  run?(moduleId: string, context: ModuleContext): void;

  /**
   * Cleanup the module
   * Called when the module ends
   * Optional - modules can implement this for cleanup logic
   */
  cleanup?(moduleId: string): void;

  /**
   * Handle function action for an interactable
   * Called when an interactable with Function action is clicked
   * Optional - modules can implement this to provide custom interactable logic
   */
  handleInteractableFunction?(
    interactableId: string,
    functionName: string,
    context: ModuleContext
  ): InteractableFunctionResult | Promise<InteractableFunctionResult>;

  /**
   * Handle dialogue completion action
   * Called when a dialogue completes with an onComplete action
   * Only called for actions that the engine doesn't handle automatically ('function' type)
   * Optional - modules can implement this to handle custom dialogue completion logic
   */
  handleDialogueCompletion?(
    dialogueId: string,
    action: DialogueCompletionAction,
    context: ModuleContext
  ): void | Promise<void>;
}
