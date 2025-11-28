/**
 * Core Module State
 * Minimal state required by the engine to function
 * Modules define their own separate state structures
 * No dependencies - foundation type
 */

/**
 * Core engine-managed module state
 * This contains only the minimal state required by the engine
 */
export interface ModuleState {
  /**
   * List of completed task IDs
   */
  completedTasks: string[];

  /**
   * Currently active task ID (if any)
   */
  currentTaskId?: string;

  /**
   * Whether the current task is ready to submit
   */
  readyToSubmit?: boolean;

  /**
   * Map of dialogue IDs to whether they've been seen
   * dialogueId -> has seen
   */
  seenGreetings: Record<string, boolean>;
}

/**
 * Default empty module state
 */
export const defaultModuleState: ModuleState = {
  completedTasks: [],
  seenGreetings: {},
};

/**
 * Core state keys - keys that belong to the core ModuleState interface
 * Used to distinguish between core state and custom module state
 */
export const CORE_STATE_KEYS: ReadonlyArray<keyof ModuleState> = [
  'completedTasks',
  'currentTaskId',
  'readyToSubmit',
  'seenGreetings',
] as const;

/**
 * Type guard to check if a key is a core state key
 * 
 * @param key - Key to check
 * @returns True if key is a core state key
 */
export function isCoreStateKey(key: string): key is keyof ModuleState {
  return CORE_STATE_KEYS.includes(key as keyof ModuleState);
}

