/**
 * Unified Zustand store for module state management
 * Single source of truth - no StorageService duplication
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ModuleProgress } from '../types/moduleState.types.js';
import type { ModuleData } from '../types/module.types.js';

/**
 * Module store state interface
 */
interface ModuleStoreState {
  // Current module (not persisted - loaded on demand)
  currentModule: ModuleData | null;
  currentModuleId: string | null;
  
  // Progress (persisted)
  progress: Record<string, ModuleProgress>;
  
  // Completed modules (persisted)
  completedModules: string[];
  
  // Actions
  setModule: (module: ModuleData) => void;
  setModuleId: (moduleId: string | null) => void;
  updateProgress: (moduleId: string, updates: Partial<ModuleProgress>) => void;
  getProgress: (moduleId: string) => ModuleProgress | null;
  clearModule: () => void;
  
  // Completed modules helpers
  addCompletedModule: (moduleId: string) => void;
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
}

/**
 * Initial module progress
 */
const initialProgress: ModuleProgress = {
  completedTasks: [],
  state: {},
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
      completedModules: [],
      
      // Set current module
      setModule: (module) => set({ currentModule: module }),
      
      // Set current module ID
      setModuleId: (moduleId) => set({ currentModuleId: moduleId }),
      
      // Add completed module
      addCompletedModule: (moduleId) => {
        const completed = get().completedModules;
        if (!completed.includes(moduleId)) {
          set({ completedModules: [...completed, moduleId] });
        }
      },
      
      // Check if module is completed
      isModuleCompleted: (moduleId) => {
        return get().completedModules.includes(moduleId);
      },
      
      // Get completed modules
      getCompletedModules: () => get().completedModules,
      
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
        const completedTasks = progress.completedTasks || [];
        if (!completedTasks.includes(taskId)) {
          get().updateProgress(moduleId, {
            completedTasks: [...completedTasks, taskId],
            state: {
              ...progress.state,
              currentTaskId: undefined,  // Clear active task
            },
          });
        }
      },
      
      // Check if task is completed
      isTaskCompleted: (moduleId, taskId) => {
        const progress = get().getProgress(moduleId);
        return progress?.completedTasks?.includes(taskId) || false;
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
    }),
    {
      name: 'module-progress',
      partialize: (state) => ({
        // Persist progress, current module ID, and completed modules
        progress: state.progress,
        currentModuleId: state.currentModuleId,
        completedModules: state.completedModules,
      }),
    }
  )
);

/**
 * Selector hooks for common use cases
 */
export const useCurrentModuleId = () => useModuleStore((state) => state.currentModuleId);
export const useCurrentModule = () => useModuleStore((state) => state.currentModule);
export const useModuleProgress = (moduleId: string) => 
  useModuleStore((state) => state.getProgress(moduleId));

/**
 * Get module actions - stable references
 */
export const useModuleActions = () => {
  const setModule = useModuleStore((state) => state.setModule);
  const setModuleId = useModuleStore((state) => state.setModuleId);
  const updateProgress = useModuleStore((state) => state.updateProgress);
  const clearModule = useModuleStore((state) => state.clearModule);
  const acceptTask = useModuleStore((state) => state.acceptTask);
  const completeTask = useModuleStore((state) => state.completeTask);
  const isTaskCompleted = useModuleStore((state) => state.isTaskCompleted);
  const getCurrentTaskId = useModuleStore((state) => state.getCurrentTaskId);
  const hasSeenGreeting = useModuleStore((state) => state.hasSeenGreeting);
  const markGreetingSeen = useModuleStore((state) => state.markGreetingSeen);
  const addCompletedModule = useModuleStore((state) => state.addCompletedModule);
  const isModuleCompleted = useModuleStore((state) => state.isModuleCompleted);
  const getCompletedModules = useModuleStore((state) => state.getCompletedModules);
  
  return {
    setModule,
    setModuleId,
    updateProgress,
    clearModule,
    acceptTask,
    completeTask,
    isTaskCompleted,
    getCurrentTaskId,
    hasSeenGreeting,
    markGreetingSeen,
    addCompletedModule,
    isModuleCompleted,
    getCompletedModules,
  };
};
