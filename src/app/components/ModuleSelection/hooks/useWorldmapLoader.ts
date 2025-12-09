/**
 * useWorldmapLoader Hook
 * Handles worldmap loading and module discovery
 */

import { useEffect, useState } from 'react';
import { discoverModules, getModule } from '@core/module/registry.js';
import { loadModuleInstance } from '@core/module/loader.js';
import { generateWorldmap } from '@core/worldmap/generator.js';
import { initializeModuleProgression } from '@core/unlock/service.js';
import { handleError } from '@services/errorService.js';
import type { WorldmapConfig } from '@core/worldmap/types.js';

export interface UseWorldmapLoaderReturn {
  worldmap: WorldmapConfig | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for loading worldmap configuration
 */
export function useWorldmapLoader(): UseWorldmapLoaderReturn {
  const [worldmap, setWorldmap] = useState<WorldmapConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadWorldmap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Discover modules
        const moduleIds = await discoverModules();

        // Load all modules to register them (needed for worldmap generation)
        for (const moduleId of moduleIds) {
          await loadModuleInstance(moduleId);
        }

        // Initialize module progression using unlock service
        await initializeModuleProgression(moduleIds);

        // Generate worldmap configuration
        const config = await generateWorldmap(moduleIds);
        setWorldmap(config);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        handleError(error, { context: 'loadWorldmap' });
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadWorldmap();
  }, []);

  return { worldmap, loading, error };
}

