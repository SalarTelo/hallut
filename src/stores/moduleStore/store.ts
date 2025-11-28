/**
 * Module Store
 * Core store definition with Zustand and persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModuleProgress } from '../../types/core/moduleProgress.types.js';
import type { ModuleProgressionState } from '../../types/core/moduleProgression.types.js';
import { defaultModuleState, isCoreStateKey } from '../../types/core/moduleState.types.js';
import type { ModuleStoreState } from './types.js';
import { updateCoreState, updateCustomState } from './helpers.js';

/**
 * Initial module progress
 */
const initialProgress: ModuleProgress = {
  state: defaultModuleState,
};

/**
 * Create the module store with persistence
 */
export const useModuleStore = create<ModuleStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentModule: null,
      currentModuleId: null,
      progress: {},
      moduleProgression: {},

      // Set current module
      setModule: (module) => set({ currentModule: module }),

      // Set current module ID
      setModuleId: (moduleId) => set({ currentModuleId: moduleId }),

      // Check if module is completed (derived from moduleProgression)
      isModuleCompleted: (moduleId) => {
        const progression = get().moduleProgression[moduleId];
        return progression?.state === 'completed';
      },

      // Get completed modules (derived from moduleProgression)
      getCompletedModules: () => {
        const progression = get().moduleProgression;
        return Object.keys(progression).filter(
          (moduleId) => progression[moduleId]?.state === 'completed'
        );
      },

      // Update progress for a module
      updateProgress: (moduleId, updates) => {
        const current = get().progress[moduleId] || initialProgress;
        set({
          progress: {
            ...get().progress,
            [moduleId]: { ...current, ...updates },
          },
        });
      },

      // Get progress for a module
      getProgress: (moduleId) => get().progress[moduleId] || null,

      // Clear current module
      clearModule: () => set({ currentModule: null, currentModuleId: null }),

      // Accept a task
      acceptTask: (moduleId, taskId) => {
        const progress = get().getProgress(moduleId) || initialProgress;
        get().updateProgress(moduleId, {
          state: {
            ...progress.state,
            currentTaskId: taskId,
          },
        });
      },

      // Complete a task
      completeTask: (moduleId, taskId) => {
        const progress = get().getProgress(moduleId) || initialProgress;
        const completedTasks = progress.state.completedTasks || [];
        if (!completedTasks.includes(taskId)) {
          get().updateProgress(moduleId, {
            state: {
              ...progress.state,
              completedTasks: [...completedTasks, taskId],
              currentTaskId: undefined, // Clear active task
            },
          });
        }
      },

      // Check if task is completed
      isTaskCompleted: (moduleId, taskId) => {
        const progress = get().getProgress(moduleId);
        return progress?.state?.completedTasks?.includes(taskId) || false;
      },

      // Get current task ID
      getCurrentTaskId: (moduleId) => {
        const progress = get().getProgress(moduleId);
        return progress?.state?.currentTaskId || null;
      },

      // Check if greeting has been seen
      hasSeenGreeting: (moduleId, dialogueId) => {
        const progress = get().getProgress(moduleId);
        return progress?.state?.seenGreetings?.[dialogueId] || false;
      },

      // Mark greeting as seen
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

      // Set module state field (core or custom)
      setModuleStateField: (moduleId, key, value) => {
        const progress = get().getProgress(moduleId) || initialProgress;
        if (isCoreStateKey(key)) {
          updateCoreState(moduleId, key, value, progress, get().updateProgress);
        } else {
          updateCustomState(moduleId, key, value, progress, get().updateProgress);
        }
      },

      // Get module progression state
      getModuleProgression: (moduleId) => {
        const progression = get().moduleProgression[moduleId];
        return progression?.state || 'locked';
      },

      // Set module progression state
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

      // Unlock a module
      unlockModule: (moduleId) => {
        get().setModuleProgression(moduleId, 'unlocked');
      },

      // Complete a module
      completeModule: (moduleId) => {
        get().setModuleProgression(moduleId, 'completed');
      },
    }),
    {
      name: 'module-progress',
      partialize: (state) => ({
        // Persist progress, current module ID, and progression only
        progress: state.progress,
        currentModuleId: state.currentModuleId,
        moduleProgression: state.moduleProgression,
      }),
    }
  )
);

