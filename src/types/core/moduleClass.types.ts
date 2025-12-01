/**
 * Module Class Interface
 * Defines the interface that all modules must implement
 * Depends on: ModuleConfig (will be defined in module types)
 */

import type { ModuleConfig } from '../module/moduleConfig.types.js';
import type { ChoiceAction } from '../choiceTypes.js';

import type { Task } from '../module/moduleConfig.types.js';

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
   * Accept a task (supports both string ID and direct task reference)
   */
  acceptTask: (task: Task | string) => void;

  /**
   * Complete a task (supports both string ID and direct task reference)
   */
  completeTask: (task: Task | string) => void;

  /**
   * Check if a task is completed (supports both string ID and direct task reference)
   */
  isTaskCompleted: (task: Task | string) => boolean;

  /**
   * Get current active task (returns Task object or null)
   */
  getCurrentTask: () => Task | null;

  /**
   * Get current active task ID (for backward compatibility)
   */
  getCurrentTaskId: () => string | null;

  /**
   * Open task submission view for a task (supports both string ID and direct task reference)
   */
  openTaskSubmission?: (task: Task | string) => void;
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
   * Handle choice action
   * Called when a dialogue choice is selected with a call-function action
   * Only called for 'call-function' actions that need custom handling
   * Optional - modules can implement this to handle custom choice logic
   */
  handleChoiceAction?(
    dialogueId: string,
    action: ChoiceAction,
    context: ModuleContext
  ): void | Promise<void>;
}
