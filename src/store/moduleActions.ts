/**
 * Centralized action creators for module state changes
 * All state changes should go through these actions
 */

import { useModuleStore } from './moduleStore.js';
import type { ModuleState } from '../types/moduleState.types.js';

/**
 * Module actions - centralized action creators
 */
export const moduleActions = {
  /**
   * Accept a task
   */
  acceptTask: (moduleId: string, taskId: string) => {
    const store = useModuleStore.getState();
    store.acceptTask(moduleId, taskId);
  },
  
  /**
   * Complete a task
   */
  completeTask: (moduleId: string, taskId: string) => {
    const store = useModuleStore.getState();
    store.completeTask(moduleId, taskId);
  },
  
  /**
   * Set ready to submit flag
   */
  setReadyToSubmit: (moduleId: string, ready: boolean) => {
    const store = useModuleStore.getState();
    const progress = store.getProgress(moduleId);
    if (progress) {
      store.updateProgress(moduleId, {
        state: {
          ...progress.state,
          readyToSubmit: ready,
        },
      });
    }
  },
  
  /**
   * Set submission type and config
   */
  setSubmissionType: (
    moduleId: string,
    type: ModuleState['submissionType'],
    component?: string,
    config?: Record<string, unknown>
  ) => {
    const store = useModuleStore.getState();
    const progress = store.getProgress(moduleId);
    if (progress) {
      store.updateProgress(moduleId, {
        state: {
          ...progress.state,
          submissionType: type,
          submissionComponent: component,
          submissionConfig: config,
        },
      });
    }
  },
  
  /**
   * Update module state field
   */
  setModuleStateField: <K extends keyof ModuleState>(
    moduleId: string,
    key: K,
    value: ModuleState[K]
  ) => {
    const store = useModuleStore.getState();
    const progress = store.getProgress(moduleId);
    if (progress) {
      store.updateProgress(moduleId, {
        state: {
          ...progress.state,
          [key]: value,
        },
      });
    }
  },
  
  /**
   * Mark greeting as seen
   */
  markGreetingSeen: (moduleId: string, dialogueId: string) => {
    const store = useModuleStore.getState();
    store.markGreetingSeen(moduleId, dialogueId);
  },
};

