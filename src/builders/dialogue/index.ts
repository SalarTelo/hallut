/**
 * Dialogue Builders
 * Central export for all dialogue builders
 */

// State reference
export { createStateRef, type StateRef } from './stateRef.js';

// Node creation
export { createDialogueNode, getNodeDefinition } from './nodes.js';

// Tree builder
export { createDialogueTree } from './tree.js';

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

// Legacy builders removed - use createDialogueTree() and createDialogueNode() instead

