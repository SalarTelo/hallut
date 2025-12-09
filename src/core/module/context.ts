/**
 * Module Context
 * Creates module context for modules to interact with the engine
 */

import { actions } from '../state/actions.js';
import { useAppStore } from '../state/store.js';
import type { ModuleContext, ModuleData } from './types/index.js';

/**
 * Create module context
 */
export function createModuleContext(moduleId: string, locale: string, moduleData: ModuleData): ModuleContext {
  return {
    moduleId,
    locale,
    setModuleStateField: (key, value) => actions.setModuleStateField(moduleId, key, value),
    getModuleStateField: (key) => actions.getModuleStateField(moduleId, key),
    acceptTask: (task) => actions.acceptTask(moduleId, task),
    completeTask: (task) => actions.completeTask(moduleId, task),
    isTaskCompleted: (task) => actions.isTaskCompleted(moduleId, task),
    getCurrentTask: () => {
      const taskId = actions.getCurrentTaskId(moduleId);
      if (!taskId) return null;
      
      const currentModule = useAppStore.getState().currentModule;
      if (!currentModule || currentModule.id !== moduleId) return null;
      
      return currentModule.tasks.find(t => t.id === taskId) || null;
    },
    getCurrentTaskId: () => actions.getCurrentTaskId(moduleId),
    setInteractableState: (interactableId, key, value) => 
      actions.setInteractableStateField(moduleId, interactableId, key, value),
    getInteractableState: (interactableId, key) => 
      actions.getInteractableStateField(moduleId, interactableId, key),
    getInteractable: (interactableId) => 
      moduleData.interactables.find(i => i.id === interactableId) || null,
  };
}

