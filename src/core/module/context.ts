/**
 * Module Context
 * Creates module context for modules to interact with the engine
 */

import { actions } from '../state/actions.js';
import { useAppStore } from '../state/store.js';
import type { ModuleContext } from '../types/module.js';
import type { Task } from '../types/task.js';

/**
 * Create module context
 */
export function createModuleContext(moduleId: string, locale: string): ModuleContext {
  return {
    moduleId,
    locale,
    setModuleStateField: (key: string, value: unknown) => {
      actions.setModuleStateField(moduleId, key, value);
    },
    getModuleStateField: (key: string) => {
      return actions.getModuleStateField(moduleId, key);
    },
    acceptTask: (task: Task | string) => {
      actions.acceptTask(moduleId, task);
    },
    completeTask: (task: Task | string) => {
      actions.completeTask(moduleId, task);
    },
    isTaskCompleted: (task: Task | string) => {
      return actions.isTaskCompleted(moduleId, task);
    },
    getCurrentTask: () => {
      const taskId = actions.getCurrentTaskId(moduleId);
      if (!taskId) return null;
      
      // Get current module from store
      const currentModule = useAppStore.getState().currentModule;
      if (!currentModule || currentModule.id !== moduleId) {
        return null;
      }
      
      // Find task by ID
      return currentModule.tasks.find(t => t.id === taskId) || null;
    },
    getCurrentTaskId: () => {
      return actions.getCurrentTaskId(moduleId);
    },
  };
}

