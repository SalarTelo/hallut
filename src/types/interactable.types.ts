/**
 * Interactable Types
 * Types for interactable objects in modules (NPCs, objects, etc.)
 * No dependencies - foundation type
 */

/**
 * Interactable types
 */
export const InteractableType = {
  NPC: 'npc',
  Object: 'object',
  Location: 'location',
} as const;

export type InteractableType = typeof InteractableType[keyof typeof InteractableType];

/**
 * Interactable action types
 */
export const InteractableActionType = {
  Dialogue: 'dialogue',
  Task: 'task',
  Function: 'function',
  Chat: 'chat',
  Image: 'image',
  ImageAnalysis: 'image-analysis',
} as const;

export type InteractableActionType = typeof InteractableActionType[keyof typeof InteractableActionType];

/**
 * Dialogue action
 * Triggers a dialogue when interacted with
 */
export interface DialogueAction {
  type: typeof InteractableActionType.Dialogue;
  dialogue: string; // Dialogue ID
}

/**
 * Task action
 * Offers a task when interacted with
 */
export interface TaskAction {
  type: typeof InteractableActionType.Task;
  task: string; // Task ID
}

/**
 * Function action
 * Calls a custom function when interacted with
 */
export interface FunctionAction {
  type: typeof InteractableActionType.Function;
  function: string; // Function name
}

/**
 * Chat action
 * Opens a chat window
 */
export interface ChatAction {
  type: typeof InteractableActionType.Chat;
  chatId?: string; // Optional chat ID for different chat instances
}

/**
 * Image action
 * Opens an image viewer
 */
export interface ImageAction {
  type: typeof InteractableActionType.Image;
  imageUrl: string;
  title?: string;
}

/**
 * Image analysis action
 * Allows users to upload an image and analyze it with Ollama vision
 */
export interface ImageAnalysisAction {
  type: typeof InteractableActionType.ImageAnalysis;
  analysisPrompt?: string; // Optional custom prompt for analysis
}

/**
 * Union type for all interactable actions
 */
export type InteractableAction = DialogueAction | TaskAction | FunctionAction | ChatAction | ImageAction | ImageAnalysisAction;

/**
 * Unlock requirement types
 */
export const UnlockRequirementType = {
  TaskComplete: 'task-complete',
  ModuleComplete: 'module-complete',
  StateCheck: 'state-check',
} as const;

export type UnlockRequirementType = typeof UnlockRequirementType[keyof typeof UnlockRequirementType];

/**
 * Unlock requirement: Task completion
 * Requires a specific task to be completed
 */
export interface TaskCompleteRequirement {
  type: typeof UnlockRequirementType.TaskComplete;
  taskId: string;
}

/**
 * Unlock requirement: Module completion
 * Requires a module to be completed
 */
export interface ModuleCompleteRequirement {
  type: typeof UnlockRequirementType.ModuleComplete;
  moduleId: string;
}

/**
 * Unlock requirement: State check
 * Checks if a state field has a specific value
 */
export interface StateCheckRequirement {
  type: typeof UnlockRequirementType.StateCheck;
  key: string;
  value: unknown;
}

/**
 * Union type for all unlock requirements
 */
export type UnlockRequirement = 
  | TaskCompleteRequirement 
  | ModuleCompleteRequirement 
  | StateCheckRequirement;

/**
 * Helper function to create a task completion requirement
 */
export function taskComplete(taskId: string): TaskCompleteRequirement {
  return { type: UnlockRequirementType.TaskComplete, taskId };
}

/**
 * Helper function to create a module completion requirement
 */
export function moduleComplete(moduleId: string): ModuleCompleteRequirement {
  return { type: UnlockRequirementType.ModuleComplete, moduleId };
}

/**
 * Helper function to create a state check requirement
 */
export function stateCheck(key: string, value: unknown): StateCheckRequirement {
  return { type: UnlockRequirementType.StateCheck, key, value };
}

/**
 * Position in percentage coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Handler function type
 */
export type HandlerFunction = (context: import('./core/moduleClass.types.js').ModuleContext) => void | Promise<void>;

/**
 * Get dialogue function - determines which dialogue to show based on context
 */
export type GetDialogueFunction = (context: import('./core/moduleClass.types.js').ModuleContext) => import('./dialogue.types.js').DialogueConfig;

/**
 * Interactable object
 * Encapsulates tasks, dialogues, handlers, and conditional logic
 * This is the main interactable type used throughout the system
 */
export interface Interactable {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Type of interactable
   */
  type: InteractableType;

  /**
   * Display name
   */
  name: string;

  /**
   * Position in the environment (percentage coordinates)
   */
  position: Position;

  /**
   * Avatar/icon (emoji or image URL)
   */
  avatar?: string;

  /**
   * Whether this interactable is initially locked
   */
  locked?: boolean;

  /**
   * Unlock requirement
   */
  unlockRequirement?: UnlockRequirement | null;

  /**
   * All dialogues this interactable can show
   * Key is dialogue ID, value is dialogue config
   */
  dialogues: Record<string, import('./dialogue.types.js').DialogueConfig>;

  /**
   * Conditional dialogue routing function
   * Determines which dialogue to show based on context
   */
  getDialogue?: GetDialogueFunction;

  /**
   * Tasks this interactable offers
   * Key is task alias, value is task object
   */
  tasks?: Record<string, import('./module/moduleConfig.types.js').Task>;

  /**
   * Handler functions for custom logic
   * Key is handler name, value is handler function
   */
  handlers?: Record<string, HandlerFunction>;
}


/**
 * Task sequence entry
 * Defines task order and prerequisites
 */
export interface TaskSequenceEntry {
  /**
   * The task (direct reference)
   */
  task: import('./module/moduleConfig.types.js').Task;

  /**
   * Which interactable offers this task (direct reference)
   */
  offeredBy: Interactable;

  /**
   * Prerequisites - tasks that must be completed first
   */
  after?: import('./module/moduleConfig.types.js').Task[];

  /**
   * Interactables to unlock when this task completes
   */
  unlocks?: Interactable[];
}

/**
 * Task sequence
 * Defines the order of tasks across all interactables
 */
export interface TaskSequence {
  entries: TaskSequenceEntry[];
}
