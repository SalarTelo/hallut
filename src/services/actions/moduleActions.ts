/**
 * Module Actions Service
 * Centralized action creators for module-related state changes
 * Separates business logic from state management
 */

import { useModuleStore } from '../../stores/moduleStore/index.js';
import type { ModuleProgress } from '../../types/core/moduleProgress.types.js';
import type { ModuleProgressionState } from '../../types/core/moduleProgression.types.js';
import { checkModuleCompletionStatus, checkModuleUnlockStatus } from '../moduleService.js';
import { handleError } from '../errorService.js';
import { ModuleError, ErrorCode } from '../../types/core/error.types.js';

/**
 * Module action creators
 * These functions encapsulate business logic and state updates
 * All store access should go through these actions for consistency
 */
export const moduleActions = {
  /**
   * Accept a task
   * Updates state and handles side effects
   */
  acceptTask: (moduleId: string, taskId: string): void => {
    const { acceptTask } = useModuleStore.getState();
    acceptTask(moduleId, taskId);
  },

  /**
   * Complete a task
   * Updates state and checks module completion
   */
  completeTask: async (moduleId: string, taskId: string): Promise<void> => {
    const { completeTask, completeModule, unlockModule } = useModuleStore.getState();
    completeTask(moduleId, taskId);
    
    // Check if module should be completed
    try {
      const { isCompleted, modulesToUnlock } = await checkModuleCompletionStatus(moduleId);
      
      if (isCompleted) {
        completeModule(moduleId);
        
        // Unlock dependent modules
        for (const otherModuleId of modulesToUnlock) {
          unlockModule(otherModuleId);
        }
      }
    } catch (error) {
      const moduleError = new ModuleError(
        ErrorCode.MODULE_INVALID,
        moduleId,
        `Error checking module completion: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { originalError: error }
      );
      handleError(moduleError);
    }
  },

  /**
   * Unlock a module if dependencies are met
   */
  unlockModule: async (moduleId: string): Promise<boolean> => {
    try {
      const { shouldUnlock } = await checkModuleUnlockStatus(moduleId);
      
      if (shouldUnlock) {
        const { unlockModule } = useModuleStore.getState();
        unlockModule(moduleId);
        return true;
      }
      
      return false;
    } catch (error) {
      const moduleError = new ModuleError(
        ErrorCode.MODULE_INVALID,
        moduleId,
        `Error unlocking module: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { originalError: error }
      );
      handleError(moduleError);
      return false;
    }
  },

  /**
   * Get module progress
   */
  getProgress: (moduleId: string): ModuleProgress | null => {
    const { getProgress } = useModuleStore.getState();
    return getProgress(moduleId);
  },

  /**
   * Get module progression state
   */
  getModuleProgression: (moduleId: string): ModuleProgressionState => {
    const { getModuleProgression } = useModuleStore.getState();
    return getModuleProgression(moduleId);
  },

  /**
   * Set module progression state
   */
  setModuleProgression: (moduleId: string, state: ModuleProgressionState): void => {
    const { setModuleProgression } = useModuleStore.getState();
    setModuleProgression(moduleId, state);
  },

  /**
   * Check if module is completed
   */
  isModuleCompleted: (moduleId: string): boolean => {
    const { isModuleCompleted } = useModuleStore.getState();
    return isModuleCompleted(moduleId);
  },

  /**
   * Set module state field (core or custom)
   */
  setModuleStateField: (moduleId: string, key: string, value: unknown): void => {
    const { setModuleStateField } = useModuleStore.getState();
    setModuleStateField(moduleId, key, value);
  },

  /**
   * Complete a module
   */
  completeModule: (moduleId: string): void => {
    const { completeModule } = useModuleStore.getState();
    completeModule(moduleId);
  },

  /**
   * Unlock a module (direct, without dependency check)
   */
  unlockModuleDirect: (moduleId: string): void => {
    const { unlockModule } = useModuleStore.getState();
    unlockModule(moduleId);
  },

  /**
   * Check if task is completed
   */
  isTaskCompleted: (moduleId: string, taskId: string): boolean => {
    const { isTaskCompleted } = useModuleStore.getState();
    return isTaskCompleted(moduleId, taskId);
  },

  /**
   * Get current task ID
   */
  getCurrentTaskId: (moduleId: string): string | null => {
    const { getCurrentTaskId } = useModuleStore.getState();
    return getCurrentTaskId(moduleId);
  },
};
