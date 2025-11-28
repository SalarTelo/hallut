/**
 * Interactable Builder Helpers
 * Type-safe helpers for creating interactable configurations
 */

import type { 
  Interactable, 
  InteractableAction,
  UnlockRequirement,
  InteractableType,
} from '../types/interactable.types.js';
import {
  InteractableActionType,
  taskComplete,
  moduleComplete,
  stateCheck,
} from '../types/interactable.types.js';

// Re-export unlock requirement helpers for convenience
export { taskComplete, moduleComplete, stateCheck };

// ============================================================================
// Position Helper
// ============================================================================

/**
 * Position in percentage coordinates
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Create a position object
 * 
 * @param x - X position (0-100)
 * @param y - Y position (0-100)
 * 
 * @example
 * position: pos(50, 50) // Center of screen
 */
export function pos(x: number, y: number): Position {
  return { x, y };
}

// ============================================================================
// Action Builders
// ============================================================================

/**
 * Create a dialogue action
 * 
 * @param dialogueId - ID of the dialogue to trigger
 * 
 * @example
 * action: dialogueAction('guard-greeting')
 */
export function dialogueAction(dialogueId: string): InteractableAction {
  return {
    type: InteractableActionType.Dialogue,
    dialogue: dialogueId,
  };
}

/**
 * Create a task action
 * 
 * @param taskId - ID of the task to offer
 * 
 * @example
 * action: taskAction('task-1')
 */
export function taskAction(taskId: string): InteractableAction {
  return {
    type: InteractableActionType.Task,
    task: taskId,
  };
}

/**
 * Create a function action
 * 
 * @param functionName - Name of the function to call
 * 
 * @example
 * action: functionAction('guard-interact')
 */
export function functionAction(functionName: string): InteractableAction {
  return {
    type: InteractableActionType.Function,
    function: functionName,
  };
}

/**
 * Create a chat action
 * 
 * @param chatId - Optional chat ID for different chat instances
 * 
 * @example
 * action: chatAction() // Default chat
 * action: chatAction('helper-chat') // Named chat
 */
export function chatAction(chatId?: string): InteractableAction {
  return {
    type: InteractableActionType.Chat,
    chatId,
  };
}

/**
 * Create an image action
 * 
 * @param imageUrl - URL of the image to display
 * @param title - Optional title for the image viewer
 * 
 * @example
 * action: imageAction('/fridge.jpg', 'Fridge Contents')
 */
export function imageAction(imageUrl: string, title?: string): InteractableAction {
  return {
    type: InteractableActionType.Image,
    imageUrl,
    title,
  };
}

// ============================================================================
// Base Interactable Builder
// ============================================================================

/**
 * Base options for all interactables
 */
export interface BaseInteractableOptions {
  /** Display name */
  name: string;
  /** Position on screen (percentage coordinates) */
  position: Position;
  /** Avatar emoji or image URL */
  avatar?: string;
  /** Action to perform when clicked */
  action: InteractableAction;
  /** Whether initially locked */
  locked?: boolean;
  /** Unlock requirement */
  unlockWhen?: UnlockRequirement;
  /** Optional task IDs this interactable can offer */
  tasks?: string[];
}

/**
 * Create a base interactable
 * 
 * @param id - Unique ID
 * @param type - Type of interactable
 * @param options - Configuration options
 */
function createInteractable(
  id: string,
  type: InteractableType,
  options: BaseInteractableOptions
): Interactable {
  const {
    name,
    position,
    avatar,
    action,
    locked = false,
    unlockWhen = null,
    tasks,
  } = options;

  const interactable: Interactable = {
    id,
    type,
    name,
    position,
    avatar,
    locked,
    unlockRequirement: unlockWhen,
    action,
  };

  if (tasks && tasks.length > 0) {
    interactable.tasks = tasks;
  }

  return interactable;
}

// ============================================================================
// Specialized Builders
// ============================================================================

/**
 * NPC-specific options
 */
export interface NPCOptions extends Omit<BaseInteractableOptions, 'action'> {
  /** Action to perform - defaults to dialogue if dialogueId provided */
  action?: InteractableAction;
  /** Shorthand: dialogue ID to trigger */
  dialogueId?: string;
  /** Shorthand: function name to call */
  functionName?: string;
}

/**
 * Create an NPC interactable
 * 
 * @param id - Unique ID
 * @param options - NPC configuration
 * 
 * @example
 * // NPC with dialogue
 * const guard = createNPC('guard', {
 *   name: 'Castle Guard',
 *   position: pos(50, 50),
 *   avatar: '🛡️',
 *   dialogueId: 'guard-greeting'
 * });
 * 
 * // NPC with function handler
 * const merchant = createNPC('merchant', {
 *   name: 'Merchant',
 *   position: pos(30, 40),
 *   avatar: '🧑‍💼',
 *   functionName: 'merchant-interact'
 * });
 */
export function createNPC(id: string, options: NPCOptions): Interactable {
  const { dialogueId, functionName, action: providedAction, ...rest } = options;

  let action: InteractableAction;
  
  if (providedAction) {
    action = providedAction;
  } else if (dialogueId) {
    action = dialogueAction(dialogueId);
  } else if (functionName) {
    action = functionAction(functionName);
  } else {
    throw new Error(`NPC "${id}" must have either action, dialogueId, or functionName`);
  }

  return createInteractable(id, 'npc', { ...rest, action });
}

/**
 * Object-specific options
 */
export interface ObjectOptions extends Omit<BaseInteractableOptions, 'action'> {
  /** Action to perform */
  action?: InteractableAction;
  /** Shorthand: image URL to display */
  imageUrl?: string;
  /** Shorthand: image title */
  imageTitle?: string;
  /** Shorthand: dialogue ID */
  dialogueId?: string;
}

/**
 * Create an object interactable
 * 
 * @param id - Unique ID
 * @param options - Object configuration
 * 
 * @example
 * // Object showing an image
 * const fridge = createObject('fridge', {
 *   name: 'Fridge',
 *   position: pos(75, 40),
 *   avatar: '🧊',
 *   imageUrl: '/fridge.jpg',
 *   imageTitle: 'Fridge Contents',
 *   locked: true,
 *   unlockWhen: taskComplete('task-1')
 * });
 * 
 * // Object with dialogue
 * const signpost = createObject('signpost', {
 *   name: 'Signpost',
 *   position: pos(20, 60),
 *   avatar: '📜',
 *   dialogueId: 'signpost-message'
 * });
 */
export function createObject(id: string, options: ObjectOptions): Interactable {
  const { imageUrl, imageTitle, dialogueId, action: providedAction, ...rest } = options;

  let action: InteractableAction;
  
  if (providedAction) {
    action = providedAction;
  } else if (imageUrl) {
    action = imageAction(imageUrl, imageTitle);
  } else if (dialogueId) {
    action = dialogueAction(dialogueId);
  } else {
    throw new Error(`Object "${id}" must have either action, imageUrl, or dialogueId`);
  }

  return createInteractable(id, 'object', { ...rest, action });
}

/**
 * Location-specific options
 */
export interface LocationOptions extends Omit<BaseInteractableOptions, 'action'> {
  /** Action to perform - defaults to dialogue */
  action?: InteractableAction;
  /** Shorthand: dialogue ID */
  dialogueId?: string;
}

/**
 * Create a location interactable
 * 
 * @param id - Unique ID
 * @param options - Location configuration
 * 
 * @example
 * const entrance = createLocation('entrance', {
 *   name: 'Castle Entrance',
 *   position: pos(50, 80),
 *   avatar: '🏰',
 *   dialogueId: 'entrance-description'
 * });
 */
export function createLocation(id: string, options: LocationOptions): Interactable {
  const { dialogueId, action: providedAction, ...rest } = options;

  let action: InteractableAction;
  
  if (providedAction) {
    action = providedAction;
  } else if (dialogueId) {
    action = dialogueAction(dialogueId);
  } else {
    throw new Error(`Location "${id}" must have either action or dialogueId`);
  }

  return createInteractable(id, 'location', { ...rest, action });
}

/**
 * Create an AI companion interactable
 * 
 * @param id - Unique ID (default: 'ai-companion')
 * @param options - Partial options to override defaults
 * 
 * @example
 * const companion = createAICompanion(); // Uses defaults
 * const customCompanion = createAICompanion('helper', {
 *   name: 'Study Buddy',
 *   position: pos(20, 30),
 *   avatar: '🤖'
 * });
 */
export function createAICompanion(
  id: string = 'ai-companion',
  options: Partial<Omit<BaseInteractableOptions, 'action'>> = {}
): Interactable {
  const defaults = {
    name: 'AI Companion',
    position: pos(25, 40),
    avatar: '🤖',
  };

  return createInteractable(id, 'object', {
    ...defaults,
    ...options,
    action: chatAction(),
  });
}

