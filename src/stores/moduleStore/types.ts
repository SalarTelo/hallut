/**
 * Module Store Types
 * Type definitions for the module store
 */

import type { ModuleProgress } from '../../types/core/moduleProgress.types.js';
import type { ModuleData } from '../../types/module/moduleConfig.types.js';
import type { ModuleProgressionMap, ModuleProgressionState } from '../../types/core/moduleProgression.types.js';

/**
 * Module store state interface
 */
export interface ModuleStoreState {
  // Current module (not persisted - loaded on demand)
  currentModule: ModuleData | null;
  currentModuleId: string | null;

  // Progress (persisted)
  progress: Record<string, ModuleProgress>;

  // Module progression (persisted) - single source of truth for locked/unlocked/completed states
  moduleProgression: ModuleProgressionMap;

  // Actions
  setModule: (module: ModuleData) => void;
  setModuleId: (moduleId: string | null) => void;
  updateProgress: (moduleId: string, updates: Partial<ModuleProgress>) => void;
  getProgress: (moduleId: string) => ModuleProgress | null;
  clearModule: () => void;

  // Completed modules helpers (derived from moduleProgression)
  isModuleCompleted: (moduleId: string) => boolean;
  getCompletedModules: () => string[];

  // Task helpers
  acceptTask: (moduleId: string, taskId: string) => void;
  completeTask: (moduleId: string, taskId: string) => void;
  isTaskCompleted: (moduleId: string, taskId: string) => boolean;
  getCurrentTaskId: (moduleId: string) => string | null;

  // Greeting helpers
  hasSeenGreeting: (moduleId: string, dialogueId: string) => boolean;
  markGreetingSeen: (moduleId: string, dialogueId: string) => void;

  // Module state field helpers
  setModuleStateField: (moduleId: string, key: string, value: unknown) => void;

  // Module progression helpers
  getModuleProgression: (moduleId: string) => ModuleProgressionState;
  setModuleProgression: (moduleId: string, state: ModuleProgressionState) => void;
  unlockModule: (moduleId: string) => void;
  completeModule: (moduleId: string) => void;
}

/**
 * Actions returned by useModuleActions hook
 */
export interface ModuleActions {
  setModule: ModuleStoreState['setModule'];
  setModuleId: ModuleStoreState['setModuleId'];
  updateProgress: ModuleStoreState['updateProgress'];
  clearModule: ModuleStoreState['clearModule'];
  acceptTask: ModuleStoreState['acceptTask'];
  completeTask: ModuleStoreState['completeTask'];
  isTaskCompleted: ModuleStoreState['isTaskCompleted'];
  getCurrentTaskId: ModuleStoreState['getCurrentTaskId'];
  hasSeenGreeting: ModuleStoreState['hasSeenGreeting'];
  markGreetingSeen: ModuleStoreState['markGreetingSeen'];
  isModuleCompleted: ModuleStoreState['isModuleCompleted'];
  getCompletedModules: ModuleStoreState['getCompletedModules'];
  setModuleStateField: ModuleStoreState['setModuleStateField'];
  getModuleProgression: ModuleStoreState['getModuleProgression'];
  setModuleProgression: ModuleStoreState['setModuleProgression'];
  unlockModule: ModuleStoreState['unlockModule'];
  completeModule: ModuleStoreState['completeModule'];
}

