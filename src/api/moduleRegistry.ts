/**
 * Module Registry
 * Discovers and loads TypeScript modules using Vite glob imports
 */

import type { ModuleConfig } from '../types/module.types.js';

// Use Vite glob to discover all modules and dialogues
// This will be populated at build time
const moduleModules = import.meta.glob('/modules/*/module.ts', { eager: true }) as Record<
  string,
  { 
    module?: ModuleConfig;
    createModule?: (locale: string) => ModuleConfig;
    default?: ModuleConfig | { module: ModuleConfig; createModule?: (locale: string) => ModuleConfig };
  }
>;

const dialogueModules = import.meta.glob('/modules/*/dialogues.ts', { eager: true }) as Record<
  string,
  { dialogues?: Record<string, any>; default?: { dialogues?: Record<string, any> } }
>;

// Create registry maps
const moduleRegistry = new Map<string, ModuleConfig>();
const dialoguesRegistry = new Map<string, Record<string, any>>();

// Initialize registry
function initializeRegistry(locale: string = 'sv'): void {
  moduleRegistry.clear();
  dialoguesRegistry.clear();
  
  // Load dialogues first
  for (const [path, dialogueExport] of Object.entries(dialogueModules)) {
    const match = path.match(/\/modules\/([^/]+)\/dialogues\.ts$/);
    if (!match) continue;
    
    const moduleId = match[1];
    let dialogues = dialogueExport;
    if (dialogueExport.default) {
      dialogues = dialogueExport.default as typeof dialogueExport;
    }
    
    if (dialogues.dialogues) {
      dialoguesRegistry.set(moduleId, dialogues.dialogues);
    }
  }
  
  // Load modules
  for (const [path, moduleExport] of Object.entries(moduleModules)) {
    // Extract module ID from path: /modules/text-generation/module.ts -> text-generation
    const match = path.match(/\/modules\/([^/]+)\/module\.ts$/);
    if (!match) continue;
    
    const moduleId = match[1];
    
    // Handle different export patterns
    let module = moduleExport;
    if (moduleExport.default) {
      module = moduleExport.default as typeof moduleExport;
    }
    
    // Get module config (support both direct export and createModule function)
    let config: ModuleConfig;
    if (typeof module.createModule === 'function') {
      config = module.createModule(locale);
    } else if (module.module) {
      config = module.module;
    } else if (module && 'manifest' in module && 'tasks' in module) {
      // Direct ModuleConfig export
      config = module as ModuleConfig;
    } else {
      console.warn(`Module ${moduleId} does not export module or createModule`, module);
      continue;
    }
    
    moduleRegistry.set(moduleId, config);
  }
}

// Initialize with default locale
initializeRegistry('sv');

/**
 * Get a module by ID
 */
export function getModule(id: string, locale: string = 'sv'): ModuleConfig | null {
  // Re-initialize if locale changed (in future, we could cache per locale)
  if (locale !== 'sv') {
    initializeRegistry(locale);
  }
  
  return moduleRegistry.get(id) || null;
}

/**
 * Get all available modules
 */
export function getAllModules(locale: string = 'sv'): ModuleConfig[] {
  if (locale !== 'sv') {
    initializeRegistry(locale);
  }
  
  return Array.from(moduleRegistry.values());
}

/**
 * Get all module IDs
 */
export function getModuleIds(): string[] {
  return Array.from(moduleRegistry.keys());
}

/**
 * Get dialogues for a module
 */
export function getModuleDialogues(moduleId: string): Record<string, any> | null {
  return dialoguesRegistry.get(moduleId) || null;
}

/**
 * Update locale for all modules
 */
export function setLocale(locale: string): void {
  initializeRegistry(locale);
}

