/**
 * Application Store
 * Single Zustand store combining all slices
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createModuleSlice, type ModuleSlice } from './slices/moduleSlice.js';
import { createProgressSlice, type ProgressSlice } from './slices/progressSlice.js';
import { createProgressionSlice, type ProgressionSlice } from './slices/progressionSlice.js';
// ModuleProgression type exported below

/**
 * Application state
 */
export interface AppState {
  // Current module (from module slice)
  currentModule: ModuleSlice['currentModule'];
  currentModuleId: ModuleSlice['currentModuleId'];
  // Progress tracking (from progress slice)
  progress: ProgressSlice['progress'];
  // Module progression (from progression slice)
  moduleProgression: ProgressionSlice['moduleProgression'];
}

/**
 * Store actions
 */
export interface AppActions extends ModuleSlice, ProgressSlice, ProgressionSlice {}

/**
 * Store type
 */
export type AppStore = AppState & AppActions;

/**
 * Create application store
 */
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...createModuleSlice(set),
      ...createProgressSlice(set, get),
      ...createProgressionSlice(set, get),
    }),
    {
      name: 'app-state',
      partialize: (state) => ({
        progress: state.progress,
        currentModuleId: state.currentModuleId,
        moduleProgression: state.moduleProgression,
      }),
    }
  )
);

// Re-export ModuleProgression type for convenience
export type { ModuleProgression } from './slices/progressionSlice.js';
