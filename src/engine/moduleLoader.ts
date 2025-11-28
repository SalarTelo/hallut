/**
 * Modulladdare
 * Laddar modulklasser som implementerar IModule-gränssnittet
 */

import type { IModule } from '../types/core/moduleClass.types.js';
import type { ModuleData } from '../types/module/moduleConfig.types.js';
import type { ComponentType } from 'react';
import type { ModuleComponentProps } from '../types/module/moduleConfig.types.js';
import { registerModule, getModuleConfig } from './moduleRegistry.js';
import { generateDialoguesFromModule } from '../services/dialogueService.js';
import { DEFAULT_LOCALE } from '../constants/module.constants.js';
import { handleError } from '../services/errorService.js';
import { ModuleError, ErrorCode } from '../types/core/error.types.js';

// Cache för laddade modulinstanser
const moduleInstanceCache = new Map<string, IModule>();

/**
 * Ladda en modulklassinstans
 * Moduler bör exportera en default-instans som implementerar IModule
 * 
 * @param moduleId - Modul-ID
 * @returns Modulinstans eller null om ej hittad
 */
export async function loadModuleInstance(moduleId: string): Promise<IModule | null> {
  // Kontrollera cache
  if (moduleInstanceCache.has(moduleId)) {
    return moduleInstanceCache.get(moduleId)!;
  }

    try {
      // Ladda modul från modules-mappen med Vite glob
      // Först, hämta modulsökvägen från glob-mönstret
      const modulePath = `/modules/${moduleId}/index.ts`;
      const moduleModules = import.meta.glob('/modules/*/index.ts', { eager: false });
      const moduleLoader = moduleModules[modulePath];
      
      if (!moduleLoader) {
        const error = new ModuleError(
          ErrorCode.MODULE_NOT_FOUND,
          moduleId,
          `Modul ${moduleId} hittades inte i glob-mönster`
        );
        handleError(error);
        return null;
      }
      
      const moduleModule = await moduleLoader() as { default?: IModule; module?: IModule; [key: string]: unknown };

    // Hämta modulinstans (default-export eller namngiven export)
    const moduleInstance: IModule | undefined = moduleModule.default || moduleModule.module;
    
    if (!moduleInstance || typeof moduleInstance.init !== 'function') {
      const error = new ModuleError(
        ErrorCode.MODULE_INVALID,
        moduleId,
        `Modul ${moduleId} exporterar inte en giltig IModule-instans`
      );
      handleError(error);
      return null;
    }

    // Registrera den
    registerModule(moduleId, moduleInstance);

    // Cacha den
    moduleInstanceCache.set(moduleId, moduleInstance);

    return moduleInstance;
  } catch (error) {
    const moduleError = new ModuleError(
      ErrorCode.MODULE_LOAD_FAILED,
      moduleId,
      `Kunde inte ladda modulinstans ${moduleId}`,
      { originalError: error }
    );
    handleError(moduleError);
    return null;
  }
}

/**
 * Extrahera komponenter från modul
 * Hanterar komponentladdning med korrekt validering och felhantering
 * 
 * @param moduleId - Modul-ID
 * @returns Record med komponentnamn till komponenttyper, eller tomt objekt om inga hittades
 */
async function extractComponents(
  moduleId: string
): Promise<Record<string, ComponentType<ModuleComponentProps>>> {
  const components: Record<string, ComponentType<ModuleComponentProps>> = {};
  
  try {
    const componentsPath = `/modules/${moduleId}/components/index.ts`;
    const componentModules = import.meta.glob('/modules/*/components/index.ts', { eager: false });
    const componentLoader = componentModules[componentsPath];
    
    if (!componentLoader) {
      // Ingen komponentfil hittad - detta förväntas för moduler utan anpassade komponenter
      return components;
    }

    const componentsModule = await componentLoader();
    
    // Validera att vi fick en giltig modul
    if (!componentsModule || typeof componentsModule !== 'object') {
      console.warn(`[ModulLaddare] Ogiltig komponentmodul för ${moduleId}: förväntade objekt, fick ${typeof componentsModule}`);
      return components;
    }

    // Försök default-export först
    if ('default' in componentsModule && componentsModule.default) {
      const defaultExport = componentsModule.default;
      if (typeof defaultExport === 'object' && defaultExport !== null) {
        Object.assign(components, defaultExport);
      } else {
        console.warn(`[ModulLaddare] Ogiltig default-export för ${moduleId}-komponenter: förväntade objekt`);
      }
    } else {
      // Försök namngivna exporter (filtrera bort icke-komponentexporter)
      for (const [key, value] of Object.entries(componentsModule)) {
        if (key === 'default') continue;
        // Grundläggande validering: kontrollera om det ser ut som en React-komponent
        if (typeof value === 'function' || (typeof value === 'object' && value !== null)) {
          components[key] = value as ComponentType<ModuleComponentProps>;
        }
      }
    }
  } catch (error) {
    // Logga bara varningar för oväntade fel (inte "fil ej hittad"-fel)
    if (error instanceof Error && !error.message.includes('Failed to fetch') && !error.message.includes('404')) {
      console.warn(`[ModulLaddare] Fel vid laddning av komponenter för ${moduleId}:`, error.message);
    }
    // Misslyckas tyst för "ej hittad"-fel - komponenter är valfria
  }

  return components;
}

/**
 * Ladda moduldata (konfiguration, dialoger, komponenter)
 * Använder modulinstansen för att hämta konfiguration
 * 
 * @param moduleId - Modul-ID
 * @param locale - Lokalisering
 * @returns Moduldata eller null om ej hittad
 */
export async function loadModuleData(
  moduleId: string,
  locale: string = DEFAULT_LOCALE
): Promise<ModuleData | null> {
  const moduleInstance = await loadModuleInstance(moduleId);

  if (!moduleInstance) {
    return null;
  }

  // Hämta konfiguration från modul
  const config = await getModuleConfig(moduleId, locale);
  if (!config) {
    return null;
  }

  // Ladda dialoger med dialogtjänst
  const dialogues = generateDialoguesFromModule(config, moduleId);

  // Ladda komponenter (valfritt)
  const components = await extractComponents(moduleId);

  return {
    config,
    dialogues,
    tasks: config.tasks,
    components,
  };
}

/**
 * Rensa modulcache (användbart för hot reloading)
 * 
 * @param moduleId - Valfritt modul-ID att rensa, eller rensa alla om ej specificerat
 */
export function clearModuleCache(moduleId?: string): void {
  if (moduleId) {
    moduleInstanceCache.delete(moduleId);
  } else {
    moduleInstanceCache.clear();
  }
}
