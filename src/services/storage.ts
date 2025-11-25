/**
 * Centralized localStorage service with typed methods
 */

import type { ModuleProgress } from '../types/moduleState.types.js';

/**
 * Storage keys enum for type safety
 */
export enum StorageKey {
  LOCALE = 'locale',
  CURRENT_MODULE_ID = 'currentModuleId',
  COMPLETED_MODULES = 'completedModules',
  ANSWER_DRAFT = 'answer-draft',
}

/**
 * Storage key prefix for module progress
 */
const MODULE_PROGRESS_PREFIX = 'module-';
const MODULE_PROGRESS_SUFFIX = '-progress';

/**
 * Centralized storage service
 */
export class StorageService {
  /**
   * Get module progress from localStorage
   */
  static getModuleProgress(moduleId: string): ModuleProgress | null {
    try {
      const key = `${MODULE_PROGRESS_PREFIX}${moduleId}${MODULE_PROGRESS_SUFFIX}`;
      const data = localStorage.getItem(key);
      if (!data) return null;
      
      const progress = JSON.parse(data) as ModuleProgress;
      return progress;
    } catch (error) {
      console.error(`Failed to load module progress for ${moduleId}:`, error);
      return null;
    }
  }

  /**
   * Save module progress to localStorage
   */
  static saveModuleProgress(moduleId: string, progress: ModuleProgress): void {
    try {
      const key = `${MODULE_PROGRESS_PREFIX}${moduleId}${MODULE_PROGRESS_SUFFIX}`;
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (error) {
      console.error(`Failed to save module progress for ${moduleId}:`, error);
    }
  }

  /**
   * Get completed modules list
   */
  static getCompletedModules(): string[] {
    try {
      const data = localStorage.getItem(StorageKey.COMPLETED_MODULES);
      if (!data) return [];
      
      const modules = JSON.parse(data) as string[];
      return Array.isArray(modules) ? modules : [];
    } catch (error) {
      console.error('Failed to load completed modules:', error);
      return [];
    }
  }

  /**
   * Add a module to completed modules list
   */
  static addCompletedModule(moduleId: string): void {
    try {
      const completed = this.getCompletedModules();
      if (!completed.includes(moduleId)) {
        completed.push(moduleId);
        localStorage.setItem(StorageKey.COMPLETED_MODULES, JSON.stringify(completed));
      }
    } catch (error) {
      console.error(`Failed to add completed module ${moduleId}:`, error);
    }
  }

  /**
   * Get current module ID
   */
  static getCurrentModuleId(): string | null {
    try {
      return localStorage.getItem(StorageKey.CURRENT_MODULE_ID);
    } catch (error) {
      console.error('Failed to load current module ID:', error);
      return null;
    }
  }

  /**
   * Set current module ID
   */
  static setCurrentModuleId(moduleId: string | null): void {
    try {
      if (moduleId) {
        localStorage.setItem(StorageKey.CURRENT_MODULE_ID, moduleId);
      } else {
        localStorage.removeItem(StorageKey.CURRENT_MODULE_ID);
      }
    } catch (error) {
      console.error(`Failed to save current module ID ${moduleId}:`, error);
    }
  }

  /**
   * Get locale
   */
  static getLocale(): string | null {
    try {
      return localStorage.getItem(StorageKey.LOCALE);
    } catch (error) {
      console.error('Failed to load locale:', error);
      return null;
    }
  }

  /**
   * Set locale
   */
  static setLocale(locale: string): void {
    try {
      localStorage.setItem(StorageKey.LOCALE, locale);
    } catch (error) {
      console.error(`Failed to save locale ${locale}:`, error);
    }
  }

  /**
   * Get answer draft
   */
  static getAnswerDraft(): string | null {
    try {
      return localStorage.getItem(StorageKey.ANSWER_DRAFT);
    } catch (error) {
      console.error('Failed to load answer draft:', error);
      return null;
    }
  }

  /**
   * Save answer draft
   */
  static saveAnswerDraft(draft: string): void {
    try {
      localStorage.setItem(StorageKey.ANSWER_DRAFT, draft);
    } catch (error) {
      console.error('Failed to save answer draft:', error);
    }
  }

  /**
   * Remove answer draft
   */
  static removeAnswerDraft(): void {
    try {
      localStorage.removeItem(StorageKey.ANSWER_DRAFT);
    } catch (error) {
      console.error('Failed to remove answer draft:', error);
    }
  }

  /**
   * Clear all module-related storage
   */
  static clearModuleStorage(moduleId?: string): void {
    try {
      if (moduleId) {
        const key = `${MODULE_PROGRESS_PREFIX}${moduleId}${MODULE_PROGRESS_SUFFIX}`;
        localStorage.removeItem(key);
      } else {
        // Clear all module progress
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith(MODULE_PROGRESS_PREFIX) && key.endsWith(MODULE_PROGRESS_SUFFIX)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('Failed to clear module storage:', error);
    }
  }
}

