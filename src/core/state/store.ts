/**
 * Application Store
 * Single Zustand store for all application state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModuleData } from '../types/module.js';
import type { Task } from '../types/task.js';
import type { ModuleProgress, ModuleProgressionState } from './types.js';

/**
 * Module progress
 */
export interface ModuleProgress {
  state: {
    completedTasks: string[];
    currentTaskId?: string;
    seenGreetings: Record<string, boolean>;
    [key: string]: unknown; // Custom state
  };
  moduleState?: Record<string, unknown>; // Module-specific state
}

/**
 * Module progression state
 */
export type ModuleProgressionState = 'locked' | 'unlocked' | 'completed';

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
 * Application state
 */
export interface AppState {
  // Current module
  currentModule: ModuleData | null;
  currentModuleId: string | null;

  // Progress tracking
  progress: Record<string, ModuleProgress>;

  // Module progression (locked/unlocked/completed)
  moduleProgression: Record<string, ModuleProgression>;
}

/**
 * Store actions (defined in actions.ts)
 */
export interface AppActions {
  setCurrentModule: (module: ModuleData) => void;
  setCurrentModuleId: (moduleId: string | null) => void;
  clearCurrentModule: () => void;

  // Progress
  updateProgress: (moduleId: string, updates: Partial<ModuleProgress>) => void;
  getProgress: (moduleId: string) => ModuleProgress | null;

  // Tasks
  acceptTask: (moduleId: string, task: Task | string) => void;
  completeTask: (moduleId: string, task: Task | string) => void;
  isTaskCompleted: (moduleId: string, task: Task | string) => boolean;
  getCurrentTaskId: (moduleId: string) => string | null;

  // Greetings
  hasSeenGreeting: (moduleId: string, dialogueId: string) => boolean;
  markGreetingSeen: (moduleId: string, dialogueId: string) => void;

  // State
  setModuleStateField: (moduleId: string, key: string, value: unknown) => void;
  getModuleStateField: (moduleId: string, key: string) => unknown;

  // Progression
  getModuleProgression: (moduleId: string) => ModuleProgressionState;
  setModuleProgression: (moduleId: string, state: ModuleProgressionState) => void;
  isModuleCompleted: (moduleId: string) => boolean;
  unlockModule: (moduleId: string) => void;
  completeModule: (moduleId: string) => void;
}

/**
 * Store type
 */
export type AppStore = AppState & AppActions;

/**
 * Initial progress
 */
const initialProgress: ModuleProgress = {
  state: {
    completedTasks: [],
    seenGreetings: {},
  },
};

/**
 * Create application store
 */
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentModule: null,
      currentModuleId: null,
      progress: {},
      moduleProgression: {},

      // Current module
      setCurrentModule: (module) => set({ currentModule: module, currentModuleId: module.id }),
      setCurrentModuleId: (moduleId) => set({ currentModuleId: moduleId }),
      clearCurrentModule: () => set({ currentModule: null, currentModuleId: null }),

      // Progress
      updateProgress: (moduleId, updates) => {
        const current = get().progress[moduleId] || initialProgress;
        set({
          progress: {
            ...get().progress,
            [moduleId]: { ...current, ...updates },
          },
        });
      },

      getProgress: (moduleId) => get().progress[moduleId] || null,

      // Tasks
      acceptTask: (moduleId, task) => {
        const taskId = typeof task === 'string' ? task : task.id;
        const progress = get().getProgress(moduleId) || initialProgress;
        get().updateProgress(moduleId, {
          state: {
            ...progress.state,
            currentTaskId: taskId,
          },
        });
      },

      completeTask: (moduleId, task) => {
        const taskId = typeof task === 'string' ? task : task.id;
        const progress = get().getProgress(moduleId) || initialProgress;
        const completedTasks = progress.state.completedTasks || [];
        
        if (!completedTasks.includes(taskId)) {
          get().updateProgress(moduleId, {
            state: {
              ...progress.state,
              completedTasks: [...completedTasks, taskId],
              currentTaskId: undefined,
            },
          });
        }
      },

      isTaskCompleted: (moduleId, task) => {
        const taskId = typeof task === 'string' ? task : task.id;
        const progress = get().getProgress(moduleId);
        return progress?.state?.completedTasks?.includes(taskId) || false;
      },

      getCurrentTaskId: (moduleId) => {
        const progress = get().getProgress(moduleId);
        return progress?.state?.currentTaskId || null;
      },

      // Greetings
      hasSeenGreeting: (moduleId, dialogueId) => {
        const progress = get().getProgress(moduleId);
        return progress?.state?.seenGreetings?.[dialogueId] || false;
      },

      markGreetingSeen: (moduleId, dialogueId) => {
        const progress = get().getProgress(moduleId) || initialProgress;
        const seenGreetings = progress.state.seenGreetings || {};
        get().updateProgress(moduleId, {
          state: {
            ...progress.state,
            seenGreetings: {
              ...seenGreetings,
              [dialogueId]: true,
            },
          },
        });
      },

      // State
      setModuleStateField: (moduleId, key, value) => {
        const progress = get().getProgress(moduleId) || initialProgress;
        
        // Core state keys
        const coreKeys = ['completedTasks', 'currentTaskId', 'seenGreetings'];
        
        if (coreKeys.includes(key)) {
          get().updateProgress(moduleId, {
            state: {
              ...progress.state,
              [key]: value,
            },
          });
        } else {
          // Custom module state
          get().updateProgress(moduleId, {
            moduleState: {
              ...(progress.moduleState || {}),
              [key]: value,
            },
          });
        }
      },

      getModuleStateField: (moduleId, key) => {
        const progress = get().getProgress(moduleId);
        if (!progress) return undefined;

        const coreKeys = ['completedTasks', 'currentTaskId', 'seenGreetings'];
        if (coreKeys.includes(key)) {
          return progress.state[key];
        }
        return progress.moduleState?.[key];
      },

      // Progression
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
    }),
    {
      name: 'app-state',
      partialize: (state) => ({
        progress: state.progress,
        currentModuleId: state.currentModuleId,
        moduleProgression: state.moduleProgression,
      }),
    }
  )
);

