/**
 * Module Slice
 * State and actions for current module management
 */

import type { ModuleData } from '../../module/types/index.js';

/**
 * Module slice state
 */
export interface ModuleSlice {
  currentModule: ModuleData | null;
  currentModuleId: string | null;
  setCurrentModule: (module: ModuleData) => void;
  setCurrentModuleId: (moduleId: string | null) => void;
  clearCurrentModule: () => void;
}

/**
 * Create module slice
 */
export function createModuleSlice(set: any): ModuleSlice {
  return {
    currentModule: null,
    currentModuleId: null,
    setCurrentModule: (module) => set({ currentModule: module, currentModuleId: module.id }),
    setCurrentModuleId: (moduleId) => set({ currentModuleId: moduleId }),
    clearCurrentModule: () => set({ currentModule: null, currentModuleId: null }),
  };
}

