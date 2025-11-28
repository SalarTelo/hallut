/**
 * Modulregister
 * Upptäcker och registrerar alla tillgängliga moduler
 * Använder Vite glob för att hitta moduler vid byggtid
 */

import type { IModule } from '../types/core/moduleClass.types.js';
import type { ModuleConfig } from '../types/module/moduleConfig.types.js';
import { DEFAULT_LOCALE } from '../constants/module.constants.js';
import { handleError } from '../services/errorService.js';

/**
 * Register över alla tillgängliga moduler
 * Mappar modul-ID till modulinstans
 */
const moduleRegistry = new Map<string, IModule>();

/**
 * Modulkonfigurationscache (per lokalisering)
 * Mappar lokalisering -> moduleId -> ModuleConfig
 */
const moduleConfigCache = new Map<string, Map<string, ModuleConfig>>();

/**
 * Upptäck och registrera alla moduler
 * Använder Vite glob för att hitta alla modul index.ts-filer
 * 
 * @returns Array med upptäckta modul-ID:n
 */
export async function discoverModules(): Promise<string[]> {
  const moduleIds: string[] = [];

  try {
    // Använd Vite glob för att upptäcka alla moduler
    // Moduler bör vara i: modules/{moduleId}/index.ts
    // Vite glob-mönster behöver vara relativa till projektroten
    const moduleModules = import.meta.glob('/modules/*/index.ts', { eager: false });

    for (const path of Object.keys(moduleModules)) {
      const match = path.match(/\/modules\/([^/]+)\/index\.ts$/);
      if (!match) continue;

      const moduleId = match[1];
      moduleIds.push(moduleId);

      // Laddning av modul hanteras av moduleLoader
      // Registret spårar bara ID:n för nu
    }
  } catch (error) {
    handleError(error, { context: 'modulupptäckt' });
  }

  return moduleIds;
}

/**
 * Registrera en modulinstans
 * 
 * @param moduleId - Modul-ID
 * @param moduleInstance - Modulinstans som implementerar IModule
 */
export function registerModule(moduleId: string, moduleInstance: IModule): void {
  moduleRegistry.set(moduleId, moduleInstance);
}

/**
 * Hämta en modulinstans med ID
 * 
 * @param moduleId - Modul-ID
 * @returns Modulinstans eller null om ej hittad
 */
export function getModuleInstance(moduleId: string): IModule | null {
  return moduleRegistry.get(moduleId) || null;
}

/**
 * Hämta modulkonfiguration (cachad per lokalisering)
 * 
 * @param moduleId - Modul-ID
 * @param locale - Lokalisering
 * @returns Modulkonfiguration eller null om ej hittad
 */
export async function getModuleConfig(
  moduleId: string,
  locale: string = DEFAULT_LOCALE
): Promise<ModuleConfig | null> {
  // Kontrollera cache
  const localeCache = moduleConfigCache.get(locale) || new Map();
  if (localeCache.has(moduleId)) {
    return localeCache.get(moduleId)!;
  }

  // Hämta modulinstans
  const moduleInstance = moduleRegistry.get(moduleId);
  if (!moduleInstance) {
    return null;
  }

  // Hämta konfiguration från instans
  const config = moduleInstance.init(locale);

  // Cacha den
  if (!moduleConfigCache.has(locale)) {
    moduleConfigCache.set(locale, new Map());
  }
  moduleConfigCache.get(locale)!.set(moduleId, config);

  return config;
}

/**
 * Hämta alla registrerade modul-ID:n
 * 
 * @returns Array med modul-ID:n
 */
export function getRegisteredModuleIds(): string[] {
  return Array.from(moduleRegistry.keys());
}

/**
 * Kontrollera om en modul är registrerad
 * 
 * @param moduleId - Modul-ID
 * @returns Sant om registrerad
 */
export function isModuleRegistered(moduleId: string): boolean {
  return moduleRegistry.has(moduleId);
}

/**
 * Rensa modulkonfigurationscache (användbart när lokalisering ändras)
 * 
 * @param locale - Valfri lokalisering att rensa, eller rensa alla om ej specificerad
 */
export function clearModuleConfigCache(locale?: string): void {
  if (locale) {
    moduleConfigCache.delete(locale);
  } else {
    moduleConfigCache.clear();
  }
}
