/**
 * useModuleActions Hook
 * Provides access to module actions
 */

import { actions } from '@core/state/actions.js';

/**
 * Hook for accessing module actions
 */
export function useModuleActions() {
  return actions;
}
