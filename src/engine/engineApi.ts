/**
 * Motor-API
 * Tillhandahåller API för moduler att interagera med motorn
 * Endast typer - ingen implementation ännu
 */

import type { ModuleContext } from '../types/core/moduleClass.types.js';
import { moduleActions } from '../services/actions/moduleActions.js';
import { isCoreStateKey } from '../types/core/moduleState.types.js';

/**
 * Hjälpfunktion för att hämta modulstatusfältvärde
 * Hanterar både kärnstatusfält och anpassad modulstatus
 * 
 * @param moduleId - Modul-ID
 * @param key - Statusfältnyckel
 * @returns Statusfältvärde eller undefined
 */
function getModuleStateFieldValue(moduleId: string, key: string): unknown {
  const progress = moduleActions.getProgress(moduleId);
  if (!progress) {
    return undefined;
  }
  // Kontrollera om det är ett kärnstatusfält eller anpassad modulstatus
  if (isCoreStateKey(key)) {
    return progress.state[key];
  }
  return (progress.moduleState || {})[key];
}

/**
 * Motor-API-gränssnitt
 * Moduler kan använda detta för att interagera med motorn
 */
export interface EngineAPI {
  /**
   * Hämta modulstatusfält
   */
  getStateField: (key: string) => unknown;

  /**
   * Sätt modulstatusfält
   */
  setStateField: (key: string, value: unknown) => void;

  /**
   * Hämta aktuell lokalisering
   */
  getLocale: () => string;
}

/**
 * Skapa modulkontext för en modul
 * Tillhandahåller åtkomst till motorfunktionalitet
 * 
 * @param moduleId - Modul-ID
 * @param locale - Aktuell lokalisering
 * @returns Modulkontext
 */
export function createModuleContext(moduleId: string, locale: string): ModuleContext {
  return {
    moduleId,
    locale,
    setModuleStateField: (key: string, value: unknown) => {
      moduleActions.setModuleStateField(moduleId, key, value);
    },
    getModuleStateField: (key: string) => {
      return getModuleStateFieldValue(moduleId, key);
    },
    acceptTask: (taskId: string) => {
      moduleActions.acceptTask(moduleId, taskId);
    },
    completeTask: (taskId: string) => {
      moduleActions.completeTask(moduleId, taskId);
    },
    isTaskCompleted: (taskId: string) => {
      return moduleActions.isTaskCompleted(moduleId, taskId);
    },
    getCurrentTaskId: () => {
      return moduleActions.getCurrentTaskId(moduleId);
    },
  };
}

/**
 * Skapa motor-API-instans för en modul
 * 
 * @param moduleId - Modul-ID
 * @param locale - Aktuell lokalisering
 * @returns Motor-API-instans
 */
export function createEngineAPI(moduleId: string, locale: string): EngineAPI {
  return {
    getStateField: (key: string) => {
      return getModuleStateFieldValue(moduleId, key);
    },
    setStateField: (key: string, value: unknown) => {
      moduleActions.setModuleStateField(moduleId, key, value);
    },
    getLocale: () => locale,
  };
}
