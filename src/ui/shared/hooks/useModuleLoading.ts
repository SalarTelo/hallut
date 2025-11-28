/**
 * useModuleLoading Hook
 * Handles module loading logic and state management
 */

import { useEffect, useState, useCallback } from 'react';
import { startModule, stopModule } from '@engine/moduleOrchestrator.js';
import { useModuleStore, useModuleActions } from '@stores/moduleStore/index.js';
import { DEFAULT_LOCALE } from '@constants/module.constants.js';
import { ModuleError, ErrorCode } from '@types/core/error.types.js';
import { handleError } from '@services/errorService.js';
import type { ModuleData } from '@types/module/moduleConfig.types.js';

export interface UseModuleLoadingOptions {
  moduleId: string;
  locale?: string;
  onError?: (error: Error) => void;
}

type ModuleState = 'idle' | 'loading' | 'running' | 'error' | 'completed';

/**
 * Compatible state object that mimics XState state shape
 */
interface ModuleStateObject {
  value: ModuleState;
  context: {
    moduleId: string | null;
    moduleData: ModuleData | null;
    locale: string;
    error: Error | null;
  };
}

export interface UseModuleLoadingReturn {
  state: ModuleStateObject;
  send: (event: { type: 'EXIT_MODULE' | 'COMPLETE_MODULE' }) => void;
  currentModule: ModuleData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Hook for managing module loading lifecycle
 */
export function useModuleLoading({
  moduleId,
  locale = DEFAULT_LOCALE,
  onError,
}: UseModuleLoadingOptions): UseModuleLoadingReturn {
  const [moduleState, setModuleState] = useState<ModuleState>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const { setModule, setModuleId, clearModule } = useModuleActions();
  const currentModule = useModuleStore((store) => store.currentModule) as ModuleData | null;

  // Handle state transitions
  const send = useCallback((event: { type: 'EXIT_MODULE' | 'COMPLETE_MODULE' }) => {
    if (event.type === 'EXIT_MODULE') {
      setModuleState('idle');
      setModuleData(null);
      setError(null);
      clearModule();
    } else if (event.type === 'COMPLETE_MODULE') {
      setModuleState('completed');
    }
  }, [clearModule]);

  // Trigger module load when component mounts or moduleId changes
  useEffect(() => {
    if (moduleState === 'idle') {
      setModuleState('loading');
    }
  }, [moduleId, locale, moduleState]);

  // Actually load the module
  useEffect(() => {
    if (moduleState === 'loading') {
      const loadModuleData = async () => {
        try {
          const data = await startModule(moduleId, locale);
          if (data) {
            setModuleData(data);
            setModule(data);
            setModuleId(moduleId);
            setModuleState('running');
          } else {
            const loadError = new ModuleError(
              ErrorCode.MODULE_LOAD_FAILED,
              moduleId,
              `Failed to load module: ${moduleId}`
            );
            handleError(loadError);
            setError(loadError);
            setModuleState('error');
            onError?.(loadError);
          }
        } catch (err) {
          const engineError = err instanceof Error
            ? new ModuleError(
                ErrorCode.MODULE_LOAD_FAILED,
                moduleId,
                err.message,
                { originalError: err }
              )
            : new ModuleError(
                ErrorCode.MODULE_LOAD_FAILED,
                moduleId,
                'Unknown error occurred while loading module'
              );
          handleError(engineError);
          setError(engineError);
          setModuleState('error');
          onError?.(engineError);
        }
      };

      loadModuleData();
    }
  }, [moduleId, locale, moduleState, setModule, setModuleId, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopModule(moduleId);
      clearModule();
    };
  }, [moduleId, clearModule]);

  // Create compatible state object
  const state: ModuleStateObject = {
    value: moduleState,
    context: {
      moduleId: moduleState === 'idle' ? null : moduleId,
      moduleData,
      locale,
      error,
    },
  };

  return {
    state,
    send,
    currentModule,
    isLoading: moduleState === 'loading',
    isError: moduleState === 'error',
    error,
  };
}

