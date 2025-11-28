/**
 * useModuleDiscovery Hook
 * Handles module discovery, registration, and worldmap generation
 */

import { useEffect, useState } from 'react';
import { discoverModules } from '@engine/moduleRegistry.js';
import { loadModuleInstance } from '@engine/moduleLoader.js';
import { initializeModuleProgression } from '@services/moduleService.js';
import { getWorldmap } from '@services/worldmapService.js';
import { handleError } from '@services/errorService.js';
import type { WorldmapConfig } from '@types/worldmap.types.js';

export interface UseModuleDiscoveryReturn {
  moduleIds: string[];
  loading: boolean;
  worldmap: WorldmapConfig | null;
}

/**
 * Hook for discovering and initializing modules
 */
export function useModuleDiscovery(): UseModuleDiscoveryReturn {
  const [moduleIds, setModuleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [worldmap, setWorldmap] = useState<WorldmapConfig | null>(null);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const discovered = await discoverModules();
        setModuleIds(discovered);
        
        // Register and initialize progression for discovered modules
        // Load module instances first to register them
        for (const moduleId of discovered) {
          await loadModuleInstance(moduleId);
        }
        
        // Now initialize progression with the discovered module IDs
        await initializeModuleProgression(discovered);
        
        // Generate worldmap
        const worldmapConfig = await getWorldmap();
        setWorldmap(worldmapConfig);
      } catch (error) {
        handleError(error, { context: 'module discovery' });
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  return {
    moduleIds,
    loading,
    worldmap,
  };
}
