/**
 * Modulorchestrator
 * Orkestrerar modulens livscykel (init, run, cleanup)
 */

import type { ModuleData } from '../types/module/moduleConfig.types.js';
import { loadModuleInstance, loadModuleData } from './moduleLoader.js';
import { createModuleContext } from './engineApi.js';
import { DEFAULT_LOCALE } from '../constants/module.constants.js';
import { handleError } from '../services/errorService.js';
import { ModuleError, ErrorCode } from '../types/core/error.types.js';

// Spåra aktiva moduler
const activeModules = new Set<string>();

/**
 * Starta en modul
 * Laddar modul, initierar den och anropar run()
 * 
 * @param moduleId - Modul-ID
 * @param locale - Lokalisering
 * @returns Moduldata eller null om misslyckades
 */
export async function startModule(
  moduleId: string,
  locale: string = DEFAULT_LOCALE
): Promise<ModuleData | null> {
  // Kontrollera om redan aktiv
  if (activeModules.has(moduleId)) {
    const error = new ModuleError(
      ErrorCode.MODULE_ALREADY_ACTIVE,
      moduleId,
      `Modul ${moduleId} är redan aktiv`
    );
    handleError(error);
    return null;
  }

  // Ladda modulinstans
  const moduleInstance = await loadModuleInstance(moduleId);
  if (!moduleInstance) {
    const error = new ModuleError(
      ErrorCode.MODULE_LOAD_FAILED,
      moduleId,
      `Kunde inte ladda modul ${moduleId}`
    );
    handleError(error);
    return null;
  }

  // Ladda moduldata
  const moduleData = await loadModuleData(moduleId, locale);
  if (!moduleData) {
    const error = new ModuleError(
      ErrorCode.MODULE_LOAD_FAILED,
      moduleId,
      `Kunde inte ladda moduldata för ${moduleId}`
    );
    handleError(error);
    return null;
  }

  // Skapa kontext
  const context = createModuleContext(moduleId, locale);

  // Anropa run() om implementerad
  if (moduleInstance.run) {
    try {
      moduleInstance.run(moduleId, context);
    } catch (error) {
      const moduleError = new ModuleError(
        ErrorCode.MODULE_INVALID,
        moduleId,
        `Fel vid körning av modul ${moduleId}`,
        { originalError: error }
      );
      handleError(moduleError);
    }
  }

  // Markera som aktiv
  activeModules.add(moduleId);

  return moduleData;
}

/**
 * Stoppa en modul
 * Anropar cleanup() om implementerad
 * 
 * @param moduleId - Modul-ID
 */
export async function stopModule(moduleId: string): Promise<void> {
  if (!activeModules.has(moduleId)) {
    return;
  }

  // Hämta modulinstans
  const moduleInstance = await loadModuleInstance(moduleId);
  if (moduleInstance && moduleInstance.cleanup) {
    try {
      moduleInstance.cleanup(moduleId);
    } catch (error) {
      const moduleError = new ModuleError(
        ErrorCode.MODULE_INVALID,
        moduleId,
        `Fel vid städning av modul ${moduleId}`,
        { originalError: error }
      );
      handleError(moduleError);
    }
  }

  // Ta bort från aktiv uppsättning
  activeModules.delete(moduleId);
}

/**
 * Kontrollera om en modul är aktiv
 * 
 * @param moduleId - Modul-ID
 * @returns Sant om aktiv
 */
export function isModuleActive(moduleId: string): boolean {
  return activeModules.has(moduleId);
}

/**
 * Hämta alla aktiva modul-ID:n
 * 
 * @returns Array med aktiva modul-ID:n
 */
export function getActiveModules(): string[] {
  return Array.from(activeModules);
}
