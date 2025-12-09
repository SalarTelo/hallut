/**
 * Module Loader
 * Loads module definitions and converts them to module data
 */

import type { ModuleDefinition, ModuleData } from './types.js';
import { registerModule } from './registry.js';
import { ErrorCode, ModuleError, getErrorMessage } from '../errors.js';
import { actions } from '../state/actions.js';

/**
 * Initialize interactable state for all interactables
 */
function initializeInteractableStates(moduleId: string, interactables: import('./types.js').Interactable[]): void {
  for (const interactable of interactables) {
    actions.initializeInteractableState(moduleId, interactable.id);
  }
}

/**
 * Load a module instance
 */
export async function loadModuleInstance(moduleId: string): Promise<ModuleDefinition | null> {
  try {
    const modulePath = `/modules/${moduleId}/index.ts`;
    const moduleModules = import.meta.glob('/modules/*/index.ts', { eager: false });
    const moduleLoader = moduleModules[modulePath];

    if (!moduleLoader) {
      throw new ModuleError(
        ErrorCode.MODULE_NOT_FOUND,
        moduleId,
        `Module ${moduleId} not found`
      );
    }

    const moduleModule = await moduleLoader() as { default?: ModuleDefinition };
    const moduleDefinition = moduleModule.default;

    if (!moduleDefinition) {
      throw new ModuleError(
        ErrorCode.MODULE_INVALID,
        moduleId,
        `Module ${moduleId} does not export a default module definition`
      );
    }

    // Validate module
    if (!moduleDefinition.id || !moduleDefinition.config || !moduleDefinition.content) {
      throw new ModuleError(
        ErrorCode.MODULE_INVALID,
        moduleId,
        `Module ${moduleId} has invalid structure`
      );
    }

    // Register module
    registerModule(moduleId, moduleDefinition);

    return moduleDefinition;
  } catch (error) {
    if (error instanceof ModuleError) {
      throw error;
    }
    throw new ModuleError(
      ErrorCode.MODULE_LOAD_FAILED,
      moduleId,
      `Failed to load module: ${getErrorMessage(error)}`,
      { originalError: error }
    );
  }
}

/**
 * Load module data (config + content)
 */
export async function loadModuleData(moduleId: string): Promise<ModuleData | null> {
  const moduleDefinition = await loadModuleInstance(moduleId);
  
  if (!moduleDefinition) {
    return null;
  }

  // Initialize interactable state
  initializeInteractableStates(moduleId, moduleDefinition.content.interactables);

  return {
    id: moduleDefinition.id,
    config: moduleDefinition.config,
    interactables: moduleDefinition.content.interactables,
    tasks: moduleDefinition.content.tasks,
  };
}

