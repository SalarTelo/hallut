/**
 * Module Context Types
 * Types for module context provided to modules at runtime
 */

import type { Task } from '../../task/types.js';
import type { Interactable } from './interactables.js';

/**
 * Module context provided to modules
 */
export interface ModuleContext {
  moduleId: string;
  locale: string;
  setModuleStateField: (key: string, value: unknown) => void;
  getModuleStateField: (key: string) => unknown;
  acceptTask: (task: Task | string) => void;
  completeTask: (task: Task | string) => void;
  isTaskCompleted: (task: Task | string) => boolean;
  getCurrentTask: () => Task | null;
  getCurrentTaskId: () => string | null;
  openTaskSubmission?: (task: Task | string) => void;
  openTaskOffer?: (task: Task | string) => void;
  setInteractableState: (interactableId: string, key: string, value: unknown) => void;
  getInteractableState: (interactableId: string, key: string) => unknown;
  getInteractable: (interactableId: string) => Interactable | null;
}

