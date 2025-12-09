/**
 * useModuleLoader Hook
 * Handles module loading and error states
 */

import { useEffect, useState } from 'react';
import { loadModuleData } from '@core/module/loader.js';
import { actions } from '@core/state/actions.js';
import { ErrorCode, ModuleError } from '@core/errors.js';
import type { ModuleData } from '@core/module/types/index.js';

export interface UseModuleLoaderReturn {
  moduleData: ModuleData | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for loading module data
 */
export function useModuleLoader(moduleId: string): UseModuleLoaderReturn {
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loadModuleData(moduleId);
        if (!data) {
          throw new ModuleError(ErrorCode.MODULE_NOT_FOUND, moduleId, `Module ${moduleId} not found`);
        }
        setModuleData(data);
        actions.setCurrentModule(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load module'));
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleId]);

  return { moduleData, loading, error };
}

