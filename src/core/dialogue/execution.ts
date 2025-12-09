/**
 * Dialogue Execution
 * High-level execution orchestration - re-exports for convenience
 */

// Resolution
export {
  resolveLines,
  resolveString,
  resolveNode,
  resolveChoices,
  resolveActions,
  resolveCondition,
  resolveNodeAtRuntime,
  getNodeDefinitionFromTree,
} from './resolution.js';

// Navigation
export {
  getInitialDialogueNode,
  getNextDialogueNode,
} from './navigation.js';

// Conditions
export {
  evaluateCondition,
} from './conditions.js';

// Actions
export {
  executeActions,
} from './actions.js';

// Choices
export {
  getAvailableChoices,
} from './choices.js';
