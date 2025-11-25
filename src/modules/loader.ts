/**
 * Unified module loader
 * Loads module config, tasks, dialogues, and components in one call
 * Returns fully typed ModuleData
 */

import type { ModuleConfig, ModuleData, Task } from '../types/module.types.js';
import type { DialogueConfig } from '../types/dialogue.types.js';
import type { ComponentType } from 'react';

// Cache per locale
const moduleCache = new Map<string, Map<string, ModuleData>>();

/**
 * Load a module and return fully typed ModuleData
 */
export async function loadModule(
  moduleId: string,
  locale: string = 'sv'
): Promise<ModuleData> {
  // Check cache
  const localeCache = moduleCache.get(locale) || new Map();
  if (localeCache.has(moduleId)) {
    return localeCache.get(moduleId)!;
  }
  
  // Load module config
  const configModule = await import(`/modules/${moduleId}/module.ts`);
  const config: ModuleConfig = configModule.createModule
    ? configModule.createModule(locale)
    : configModule.module || configModule.default?.module || configModule.default;
  
  if (!config) {
    throw new Error(`Module '${moduleId}' not found or invalid`);
  }
  
  // Extract dialogues from tasks and create dialogue configs
  const dialogues: Record<string, DialogueConfig> = {};
  
  // Create dialogue config for each interactable that has dialogue action
  for (const interactable of config.interactables) {
    if (interactable.action.type === 'dialogue') {
      // Get dialogue ID from action
      const dialogueId = interactable.action.dialogue;
      
      // Check if we already have this dialogue
      if (!dialogues[dialogueId]) {
        // Create simple dialogue config (greeting will come from task or be empty)
        dialogues[dialogueId] = {
          id: dialogueId,
          speaker: interactable.id,
          greeting: [],  // Will be populated from tasks or module welcome
        };
      }
    }
  }
  
  // If module has welcome, create welcome dialogue
  if (config.welcome) {
    const welcomeDialogueId = `${moduleId}_welcome`;
    dialogues[welcomeDialogueId] = {
      id: welcomeDialogueId,
      speaker: config.welcome.speaker,
      greeting: config.welcome.lines,
    };
  }
  
  // Tasks are already in config
  const tasks = config.tasks;
  
  // Load components (optional, lazy)
  const components: Record<string, ComponentType<any>> = {};
  try {
    const componentsModule = await import(`/modules/${moduleId}/components/index.ts`);
    if (componentsModule.default) {
      Object.assign(components, componentsModule.default);
    } else {
      Object.assign(components, componentsModule);
    }
  } catch {
    // No components file, that's okay
  }
  
  const moduleData: ModuleData = {
    config,
    dialogues,
    tasks,
    components,
  };
  
  // Cache it
  if (!moduleCache.has(locale)) {
    moduleCache.set(locale, new Map());
  }
  moduleCache.get(locale)!.set(moduleId, moduleData);
  
  return moduleData;
}

/**
 * Clear module cache
 */
export function clearModuleCache(moduleId?: string, locale?: string): void {
  if (moduleId && locale) {
    moduleCache.get(locale)?.delete(moduleId);
  } else if (locale) {
    moduleCache.delete(locale);
  } else {
    moduleCache.clear();
  }
}

/**
 * Get all available module IDs
 */
export async function getModuleIds(): Promise<string[]> {
  const modules = import.meta.glob('/modules/*/module.ts', { eager: true });
  const ids: string[] = [];
  
  for (const path of Object.keys(modules)) {
    const match = path.match(/\/modules\/([^/]+)\/module\.ts$/);
    if (match) {
      ids.push(match[1]);
    }
  }
  
  return ids;
}

