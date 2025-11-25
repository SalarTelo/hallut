/**
 * Dialogue context implementation
 */

import type { DialogueContext as IDialogueContext } from '../types/dialogue.types.js';
import type { ModuleState } from '../types/moduleState.types.js';
import type { ModuleData, Task } from '../types/module.types.js';
import type { Interactable } from '../types/interactable.types.js';
import { useModuleStore } from '../store/moduleStore.js';
import { moduleActions } from '../store/moduleActions.js';

/**
 * Create dialogue context from current store state
 */
export function createDialogueContext(
  moduleId: string,
  interactable: Interactable
): IDialogueContext {
  const store = useModuleStore.getState();
  const module = store.currentModule;
  const progress = store.getProgress(moduleId);
  const moduleState = progress?.state || {};
  
  return {
    setModuleStateField: <K extends keyof ModuleState>(key: K, value: ModuleState[K]) => {
      moduleActions.setModuleStateField(moduleId, key, value);
    },
    updateModuleState: (updates: Partial<ModuleState>) => {
      if (progress) {
        store.updateProgress(moduleId, {
          state: {
            ...progress.state,
            ...updates,
          },
        });
      }
    },
    getModuleStateField: <K extends keyof ModuleState>(key: K) => {
      return moduleState[key];
    },
    moduleState,
    moduleData: module!,
    interactable,
    acceptTask: (taskId: string) => {
      moduleActions.acceptTask(moduleId, taskId);
    },
    getCurrentTask: () => {
      const taskId = moduleState.currentTaskId;
      if (!taskId || !module) return null;
      return module.tasks.find(t => t.id === taskId) || null;
    },
    isTaskCompleted: (taskId: string) => {
      return store.isTaskCompleted(moduleId, taskId);
    },
    hasSeenGreeting: (dialogueId: string) => {
      return store.hasSeenGreeting(moduleId, dialogueId);
    },
    markGreetingSeen: (dialogueId: string) => {
      store.markGreetingSeen(moduleId, dialogueId);
    },
  };
}

