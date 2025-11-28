/**
 * Module Store Selectors
 * Selector hooks for accessing store state
 */

import { useMemo } from 'react';
import { useModuleStore } from './store.js';
import type { ModuleActions } from './types.js';

/**
 * Get current module ID
 */
export const useCurrentModuleId = () => useModuleStore((state) => state.currentModuleId);

/**
 * Get current module data
 */
export const useCurrentModule = () => useModuleStore((state) => state.currentModule);

/**
 * Get module progress
 */
export const useModuleProgress = (moduleId: string) =>
  useModuleStore((state) => state.getProgress(moduleId));

/**
 * Get module progression state
 */
export const useModuleProgressionState = (moduleId: string) =>
  useModuleStore((state) => state.getModuleProgression(moduleId));

/**
 * Check if a module is completed
 */
export const useIsModuleCompleted = (moduleId: string) =>
  useModuleStore((state) => state.isModuleCompleted(moduleId));

/**
 * Check if a task is completed
 */
export const useIsTaskCompleted = (moduleId: string, taskId: string) =>
  useModuleStore((state) => state.isTaskCompleted(moduleId, taskId));

/**
 * Get current task ID for a module
 */
export const useCurrentTaskId = (moduleId: string) =>
  useModuleStore((state) => state.getCurrentTaskId(moduleId));

/**
 * Get module actions - stable references using memoization
 * This prevents re-renders by returning stable function references
 */
export const useModuleActions = (): ModuleActions => {
  const store = useModuleStore();

  return useMemo(
    () => ({
      setModule: store.setModule,
      setModuleId: store.setModuleId,
      updateProgress: store.updateProgress,
      clearModule: store.clearModule,
      acceptTask: store.acceptTask,
      completeTask: store.completeTask,
      isTaskCompleted: store.isTaskCompleted,
      getCurrentTaskId: store.getCurrentTaskId,
      hasSeenGreeting: store.hasSeenGreeting,
      markGreetingSeen: store.markGreetingSeen,
      isModuleCompleted: store.isModuleCompleted,
      getCompletedModules: store.getCompletedModules,
      setModuleStateField: store.setModuleStateField,
      getModuleProgression: store.getModuleProgression,
      setModuleProgression: store.setModuleProgression,
      unlockModule: store.unlockModule,
      completeModule: store.completeModule,
    }),
    [store]
  );
};

