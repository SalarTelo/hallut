/**
 * State Management
 *
 * This project uses Zustand for state management.
 *
 * Store Organization:
 * - dialogueStore: Current dialogue state and navigation
 * - taskStore: Task progress and submissions
 * - uiStore: UI state (modals, views, selections)
 * - moduleStore/: Module progress and configuration (folder because it's complex)
 *
 * Usage:
 * ```typescript
 * import { useDialogueStore } from '@stores/index.js';
 * import { useModuleStore } from '@stores/moduleStore/index.js';
 * ```
 *
 * Pattern: Each store is a hook that returns state and actions.
 * Use selectors for derived state to avoid unnecessary re-renders.
 */

export { useDialogueStore } from './dialogueStore.js';
export { useTaskStore } from './taskStore.js';
export { useUIStore } from './uiStore.js';

// Module store is complex and has its own folder
// Import from '@stores/moduleStore/index.js' for full access
export {
  useModuleStore,
  useCurrentModuleId,
  useCurrentModule,
  useModuleProgress,
  useModuleProgressionState,
  useIsModuleCompleted,
  useIsTaskCompleted,
  useCurrentTaskId,
  useModuleActions,
} from './moduleStore/index.js';

