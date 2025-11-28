/**
 * Module Store
 * Main entry point - re-exports all store components
 */

// Store
export { useModuleStore } from './store.js';

// Selectors
export {
  useCurrentModuleId,
  useCurrentModule,
  useModuleProgress,
  useModuleProgressionState,
  useIsModuleCompleted,
  useIsTaskCompleted,
  useCurrentTaskId,
  useModuleActions,
} from './selectors.js';

// Types
export type { ModuleStoreState, ModuleActions } from './types.js';

// Helpers (for internal use)
export { updateCoreState, updateCustomState } from './helpers.js';

