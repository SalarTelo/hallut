/**
 * State Actions
 * Centralized action creators for all state mutations
 * All store access should go through these actions
 */

import { useAppStore } from './store.js';
import type { ModuleData } from '../module/types.js';
import type { Task } from '../task/types.js';
import type { ModuleProgress, ModuleProgressionState } from './types.js';
import { getTaskId } from '../task/utils.js';

/**
 * State actions
 */
export const actions = {
  /**
   * Set current module
   */
  setCurrentModule: (module: ModuleData): void => {
    useAppStore.getState().setCurrentModule(module);
  },

  /**
   * Set current module ID
   */
  setCurrentModuleId: (moduleId: string | null): void => {
    useAppStore.getState().setCurrentModuleId(moduleId);
  },

  /**
   * Clear current module
   */
  clearCurrentModule: (): void => {
    useAppStore.getState().clearCurrentModule();
  },

  /**
   * Update module progress
   */
  updateProgress: (moduleId: string, updates: Partial<ModuleProgress>): void => {
    useAppStore.getState().updateProgress(moduleId, updates);
  },

  /**
   * Get module progress
   */
  getProgress: (moduleId: string): ModuleProgress | null => {
    return useAppStore.getState().getProgress(moduleId);
  },

  /**
   * Accept a task
   */
  acceptTask: (moduleId: string, task: Task | string): void => {
    useAppStore.getState().acceptTask(moduleId, task);
  },

  /**
   * Complete a task
   */
  completeTask: (moduleId: string, task: Task | string): void => {
    useAppStore.getState().completeTask(moduleId, task);
  },

  /**
   * Check if task is completed
   */
  isTaskCompleted: (moduleId: string, task: Task | string): boolean => {
    return useAppStore.getState().isTaskCompleted(moduleId, task);
  },

  /**
   * Get current task ID
   */
  getCurrentTaskId: (moduleId: string): string | null => {
    return useAppStore.getState().getCurrentTaskId(moduleId);
  },

  /**
   * Check if greeting has been seen
   */
  hasSeenGreeting: (moduleId: string, dialogueId: string): boolean => {
    return useAppStore.getState().hasSeenGreeting(moduleId, dialogueId);
  },

  /**
   * Mark greeting as seen
   */
  markGreetingSeen: (moduleId: string, dialogueId: string): void => {
    useAppStore.getState().markGreetingSeen(moduleId, dialogueId);
  },

  /**
   * Set module state field
   */
  setModuleStateField: (moduleId: string, key: string, value: unknown): void => {
    useAppStore.getState().setModuleStateField(moduleId, key, value);
  },

  /**
   * Get module state field
   */
  getModuleStateField: (moduleId: string, key: string): unknown => {
    return useAppStore.getState().getModuleStateField(moduleId, key);
  },

  /**
   * Get module progression state
   */
  getModuleProgression: (moduleId: string): ModuleProgressionState => {
    return useAppStore.getState().getModuleProgression(moduleId);
  },

  /**
   * Set module progression state
   */
  setModuleProgression: (moduleId: string, state: ModuleProgressionState): void => {
    useAppStore.getState().setModuleProgression(moduleId, state);
  },

  /**
   * Check if module is completed
   */
  isModuleCompleted: (moduleId: string): boolean => {
    return useAppStore.getState().isModuleCompleted(moduleId);
  },

  /**
   * Unlock a module
   */
  unlockModule: (moduleId: string): void => {
    useAppStore.getState().unlockModule(moduleId);
  },

  /**
   * Complete a module
   */
  completeModule: (moduleId: string): void => {
    useAppStore.getState().completeModule(moduleId);
  },

  /**
   * Set interactable state field
   */
  setInteractableStateField: (moduleId: string, interactableId: string, key: string, value: unknown): void => {
    useAppStore.getState().setInteractableStateField(moduleId, interactableId, key, value);
  },

  /**
   * Get interactable state field
   */
  getInteractableStateField: (moduleId: string, interactableId: string, key: string): unknown => {
    return useAppStore.getState().getInteractableStateField(moduleId, interactableId, key);
  },

  /**
   * Initialize interactable state
   */
  initializeInteractableState: (moduleId: string, interactableId: string): void => {
    useAppStore.getState().initializeInteractableState(moduleId, interactableId);
  },
};

