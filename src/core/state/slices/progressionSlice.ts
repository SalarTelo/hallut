/**
 * Progression Slice
 * State and actions for module progression (locked/unlocked/completed)
 */

import type { ModuleProgressionState } from '../types.js';

/**
 * Module progression
 */
export interface ModuleProgression {
  moduleId: string;
  state: ModuleProgressionState;
  unlockedAt?: number;
  completedAt?: number;
}

/**
 * Progression slice state
 */
export interface ProgressionSlice {
  moduleProgression: Record<string, ModuleProgression>;
  getModuleProgression: (moduleId: string) => ModuleProgressionState;
  setModuleProgression: (moduleId: string, state: ModuleProgressionState) => void;
  isModuleCompleted: (moduleId: string) => boolean;
  unlockModule: (moduleId: string) => void;
  completeModule: (moduleId: string) => void;
}

/**
 * Create progression slice
 */
export function createProgressionSlice(set: any, get: any): ProgressionSlice {
  return {
    moduleProgression: {},
    getModuleProgression: (moduleId) => {
      const progression = get().moduleProgression[moduleId];
      return progression?.state || 'locked';
    },
    setModuleProgression: (moduleId, state) => {
      const now = Date.now();
      const progression = get().moduleProgression[moduleId] || { moduleId, state: 'locked' as ModuleProgressionState };

      set({
        moduleProgression: {
          ...get().moduleProgression,
          [moduleId]: {
            ...progression,
            state,
            ...(state === 'unlocked' && !progression.unlockedAt ? { unlockedAt: now } : {}),
            ...(state === 'completed' && !progression.completedAt ? { completedAt: now } : {}),
          },
        },
      });
    },
    isModuleCompleted: (moduleId) => {
      const progression = get().moduleProgression[moduleId];
      return progression?.state === 'completed';
    },
    unlockModule: (moduleId) => {
      get().setModuleProgression(moduleId, 'unlocked');
    },
    completeModule: (moduleId) => {
      get().setModuleProgression(moduleId, 'completed');
    },
  };
}

