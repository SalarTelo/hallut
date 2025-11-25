/**
 * Dialogue system types
 */

/**
 * Dialogue configuration - simple config for NPCs
 * Just contains greeting text, dialogue comes from tasks
 */
export interface DialogueConfig {
  id: string;
  speaker: string;
  greeting: string[];  // Shown once when entering module
}

/**
 * Dialogue context - provided to dialogue handlers
 */
export interface DialogueContext {
  // State management
  setModuleStateField: <K extends keyof import('./moduleState.types.js').ModuleState>(
    key: K,
    value: import('./moduleState.types.js').ModuleState[K]
  ) => void;
  updateModuleState: (updates: Partial<import('./moduleState.types.js').ModuleState>) => void;
  getModuleStateField: <K extends keyof import('./moduleState.types.js').ModuleState>(
    key: K
  ) => import('./moduleState.types.js').ModuleState[K] | undefined;

  // Current state
  moduleState: import('./moduleState.types.js').ModuleState;
  moduleData: import('./module.types.js').ModuleData;

  // Current interaction
  interactable: import('./interactable.types.js').Interactable;

  // Task helpers
  acceptTask: (taskId: string) => void;
  getCurrentTask: () => import('./module.types.js').Task | null;
  isTaskCompleted: (taskId: string) => boolean;
  hasSeenGreeting: (dialogueId: string) => boolean;
  markGreetingSeen: (dialogueId: string) => void;
}

