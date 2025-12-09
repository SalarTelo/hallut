/**
 * Builders
 * Central export for all builders
 */

// Task builders
export * from './task/index.js';

// Dialogue builders - export all except conflicting names
export {
  stateRef,
  type StateRef,
  dialogueNode,
  getNodeDefinition,
  dialogueTree,
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
  createDialogue,
  choice,
  simpleChoice,
  type DialogueOptions,
  type ChoiceBuilder,
} from './dialogue/index.js';

// Re-export dialogue conditions/actions with dialogue prefix to avoid conflicts
export {
  taskComplete as dialogueTaskComplete,
  stateCheck as dialogueStateCheck,
} from './dialogue/conditions.js';

// Interactable builders - export all except conflicting names
export {
  pos,
  taskComplete,
  stateCheck,
  showDialogue,
  showComponent,
  showNoteViewer,
  showSignViewer,
  showChatWindow,
  showImageViewer,
  showImage,
  showNote,
  createNPC,
  type NPCOptions,
  createObject,
  createNoteObject,
  createImageObject,
  type ObjectOptions,
  createLocation,
  type LocationOptions,
} from './interactable/index.js';

// Re-export interactable moduleComplete with interactable prefix
export {
  moduleComplete as interactableModuleComplete,
} from './interactable/requirements.js';

// Module builders
export * from './module/index.js';
