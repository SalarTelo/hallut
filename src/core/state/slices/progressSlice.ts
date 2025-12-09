/**
 * Progress Slice
 * State and actions for task progress, greetings, and module state
 */

import type { Task } from '../../task/types.js';
import type { InteractableState } from '../../module/types/index.js';
import type { ModuleProgress } from '../types.js';
import { getTaskId } from '@core/task/utils.js';

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
 * Progress slice state
 */
export interface ProgressSlice {
  progress: Record<string, ModuleProgress>;
  updateProgress: (moduleId: string, updates: Partial<ModuleProgress>) => void;
  getProgress: (moduleId: string) => ModuleProgress | null;
  acceptTask: (moduleId: string, task: Task | string) => void;
  completeTask: (moduleId: string, task: Task | string) => void;
  isTaskCompleted: (moduleId: string, task: Task | string) => boolean;
  getCurrentTaskId: (moduleId: string) => string | null;
  hasSeenGreeting: (moduleId: string, dialogueId: string) => boolean;
  markGreetingSeen: (moduleId: string, dialogueId: string) => void;
  setModuleStateField: (moduleId: string, key: string, value: unknown) => void;
  getModuleStateField: (moduleId: string, key: string) => unknown;
  setInteractableStateField: (moduleId: string, interactableId: string, key: string, value: unknown) => void;
  getInteractableStateField: (moduleId: string, interactableId: string, key: string) => unknown;
  initializeInteractableState: (moduleId: string, interactableId: string) => void;
}

/**
 * Create progress slice
 */
export function createProgressSlice(set: any, get: any): ProgressSlice {
  return {
    progress: {},
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
    acceptTask: (moduleId, task) => {
      const taskId = getTaskId(task);
      const progress = get().getProgress(moduleId) || initialProgress;
      get().updateProgress(moduleId, {
        state: {
          ...progress.state,
          currentTaskId: taskId,
        },
      });
    },
    completeTask: (moduleId, task) => {
      const taskId = getTaskId(task);
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
      const taskId = getTaskId(task);
      const progress = get().getProgress(moduleId);
      return progress?.state?.completedTasks?.includes(taskId) || false;
    },
    getCurrentTaskId: (moduleId) => {
      const progress = get().getProgress(moduleId);
      return progress?.state?.currentTaskId || null;
    },
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
    setModuleStateField: (moduleId, key, value) => {
      const progress = get().getProgress(moduleId) || initialProgress;
      
      // Core state keys
      const coreKeys = ['completedTasks', 'currentTaskId', 'seenGreetings', 'conversations'];
      
      if (coreKeys.includes(key)) {
        get().updateProgress(moduleId, {
          state: {
            ...progress.state,
            [key]: value,
          },
        });
      } else {
        // Module-level state
        const moduleState = progress.moduleState || { module: {} as Record<string, unknown>, interactables: {} as Record<string, InteractableState> };
        get().updateProgress(moduleId, {
          moduleState: {
            ...moduleState,
            module: {
              ...moduleState.module,
              [key]: value,
            },
          },
        });
      }
    },
    getModuleStateField: (moduleId, key) => {
      const progress = get().getProgress(moduleId);
      if (!progress) return undefined;

      const coreKeys = ['completedTasks', 'currentTaskId', 'seenGreetings', 'conversations'];
      if (coreKeys.includes(key)) {
        return progress.state[key];
      }
      return progress.moduleState?.module?.[key];
    },
    setInteractableStateField: (moduleId, interactableId, key, value) => {
      const progress = get().getProgress(moduleId) || initialProgress;
      const moduleState = progress.moduleState || { module: {} as Record<string, unknown>, interactables: {} as Record<string, InteractableState> };
      const interactables = moduleState.interactables || {};
      const interactableState = interactables[interactableId] || ({} as InteractableState);
      
      get().updateProgress(moduleId, {
        moduleState: {
          ...moduleState,
          interactables: {
            ...interactables,
            [interactableId]: {
              ...interactableState,
              [key]: value,
            },
          },
        },
      });
    },
    getInteractableStateField: (moduleId, interactableId, key) => {
      const progress = get().getProgress(moduleId);
      if (!progress) return undefined;
      
      return progress.moduleState?.interactables?.[interactableId]?.[key];
    },
    initializeInteractableState: (moduleId, interactableId) => {
      const progress = get().getProgress(moduleId) || initialProgress;
      const moduleState = progress.moduleState || { module: {} as Record<string, unknown>, interactables: {} as Record<string, InteractableState> };
      const interactables = moduleState.interactables || {};
      
      if (!interactables[interactableId]) {
        get().updateProgress(moduleId, {
          moduleState: {
            ...moduleState,
            interactables: {
              ...interactables,
              [interactableId]: {} as InteractableState,
            },
          },
        });
      }
    },
  };
}

