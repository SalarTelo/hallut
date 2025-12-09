/**
 * Builders
 * Central export for all builders - organized by concern
 * 
 * Each section handles one specific aspect of module creation.
 * Import only what you need for your current task.
 */

// ============================================================================
// NPCs - Creating Non-Player Characters
// ============================================================================

export {
  createNPC,
  type NPCOptions,
} from './interactable/index.js';

// ============================================================================
// Dialogues - Creating conversation trees and dialogue systems
// ============================================================================

export {
  createDialogueNode,
  createDialogueTree,
  getNodeDefinition,
  createStateRef,
  type StateRef,
  taskActive,
  interactableStateCheck,
  moduleStateCheck,
  andConditions,
  orConditions,
  customCondition,
  acceptTask,
  setState,
  setInteractableState,
  setModuleState,
  callFunction,
  goToNode,
  closeDialogue,
} from './dialogue/index.js';

// Re-export dialogue conditions/actions with dialogue prefix to avoid conflicts
export {
  taskComplete as dialogueTaskComplete,
  stateCheck as dialogueStateCheck,
} from './dialogue/conditions.js';

// ============================================================================
// Objects - Creating interactive objects
// ============================================================================

export {
  createObject,
  createNoteObject,
  createImageObject,
  type ObjectOptions,
} from './interactable/index.js';

// ============================================================================
// Interactions - Defining what happens when objects are clicked
// ============================================================================

export {
  showComponent,
  showNoteViewer,
  showSignViewer,
  showChatWindow,
  showImageViewer,
  showImage,
  showNote,
  createViewer,
} from './interactable/index.js';

// ============================================================================
// Locations - Creating location markers
// ============================================================================

export {
  createLocation,
  type LocationOptions,
} from './interactable/index.js';

// ============================================================================
// Tasks - Creating tasks and activities
// ============================================================================

export * from './task/index.js';

// ============================================================================
// Modules - Module configuration and setup
// ============================================================================

export * from './module/index.js';

// ============================================================================
// Utilities - Common helpers used across different concerns
// ============================================================================

// Position
export { position, pos } from './interactable/index.js';

// Requirements/unlock conditions
export {
  taskComplete,
  stateCheck,
} from './interactable/index.js';

export {
  moduleComplete as interactableModuleComplete,
} from './interactable/requirements.js';
