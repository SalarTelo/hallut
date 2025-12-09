/**
 * Dialogue Builders
 * Central export for all dialogue builders
 */

// State reference
export { stateRef, type StateRef } from './stateRef.js';

// Node creation
export { dialogueNode, getNodeDefinition } from './nodes.js';

// Tree builder
export { dialogueTree } from './tree.js';

// Conditions
export {
  taskComplete,
  taskActive,
  stateCheck,
  interactableStateCheck,
  moduleStateCheck,
  andConditions,
  orConditions,
  customCondition,
} from './conditions.js';

// Actions
export {
  acceptTask,
  setState,
  setInteractableState,
  setModuleState,
  callFunction,
  goToNode,
  closeDialogue,
} from './actions.js';

// Legacy builders
export {
  createDialogue,
  choice,
  simpleChoice,
  type DialogueOptions,
  type ChoiceBuilder,
} from './legacy.js';

