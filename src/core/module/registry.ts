/**
 * Module Registry
 * Discovers and registers all available modules
 */

import type { ModuleDefinition, ModuleConfig } from './types.js';
import { ErrorCode, ModuleError } from '../errors.js';

/**
 * Module registry
 */
const moduleRegistry = new Map<string, ModuleDefinition>();

/**
 * Discover all modules using Vite glob
 */
export async function discoverModules(): Promise<string[]> {
  const moduleIds: string[] = [];

  try {
    const moduleModules = import.meta.glob('/modules/*/index.ts', { eager: false });

    for (const path of Object.keys(moduleModules)) {
      const match = path.match(/\/modules\/([^/]+)\/index\.ts$/);
      if (!match) continue;

      const moduleId = match[1];
      moduleIds.push(moduleId);
    }
  } catch (error) {
    throw new ModuleError(
      ErrorCode.MODULE_LOAD_FAILED,
      'unknown',
      `Error discovering modules: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { originalError: error }
    );
  }

  return moduleIds;
}

/**
 * Register a module
 */
export function registerModule(moduleId: string, module: ModuleDefinition): void {
  moduleRegistry.set(moduleId, module);
}

/**
 * Get a module definition
 */
export function getModule(moduleId: string): ModuleDefinition | null {
  return moduleRegistry.get(moduleId) || null;
}

/**
 * Get all registered module IDs
 */
export function getRegisteredModuleIds(): string[] {
  return Array.from(moduleRegistry.keys());
}

/**
 * Check if module is registered
 */
export function isModuleRegistered(moduleId: string): boolean {
  return moduleRegistry.has(moduleId);
}

/**
 * Get module configuration
 * @param moduleId - Module ID
 * @returns Module configuration or null if not found
 */
export function getModuleConfig(moduleId: string): ModuleConfig | null {
  const module = getModule(moduleId);
  return module?.config || null;
}

