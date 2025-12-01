/**
 * Module Loader
 * Loads module definitions and converts them to module data
 */

import type { ModuleDefinition, ModuleData } from '../types/module.js';
import type { DialogueConfig } from '../types/dialogue.js';
import { registerModule } from './registry.js';
import { ErrorCode, ModuleError } from '../types/errors.js';

/**
 * Extract dialogues from interactables
 */
function extractDialogues(interactables: import('../types/interactable.js').Interactable[]): Record<string, DialogueConfig> {
  const dialogues: Record<string, DialogueConfig> = {};

  for (const interactable of interactables) {
    if (interactable.type === 'npc') {
      // Extract dialogues from NPC
      for (const [dialogueId, dialogue] of Object.entries(interactable.dialogues)) {
        const fullDialogueId = `${interactable.id}-${dialogueId}`;
        dialogues[fullDialogueId] = {
          ...dialogue,
          id: fullDialogueId,
        };
      }
    } else if (interactable.type === 'object' || interactable.type === 'location') {
      // Extract dialogue from object interaction if it's a dialogue type
      if (interactable.interaction?.type === 'dialogue') {
        const dialogueId = `${interactable.id}-dialogue`;
        dialogues[dialogueId] = {
          ...interactable.interaction.dialogue,
          id: dialogueId,
        };
      }
    }
  }

  return dialogues;
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
      `Failed to load module: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { originalError: error }
    );
  }
}

/**
 * Load module data (config + content + dialogues)
 */
export async function loadModuleData(moduleId: string): Promise<ModuleData | null> {
  const moduleDefinition = await loadModuleInstance(moduleId);
  
  if (!moduleDefinition) {
    return null;
  }

  // Extract dialogues from interactables
  const dialogues = extractDialogues(moduleDefinition.content.interactables);

  // Add welcome dialogue
  const welcomeDialogueId = `${moduleId}_welcome`;
  dialogues[welcomeDialogueId] = {
    id: welcomeDialogueId,
    speaker: moduleDefinition.config.welcome.speaker,
    lines: moduleDefinition.config.welcome.lines,
  };

  return {
    id: moduleDefinition.id,
    config: moduleDefinition.config,
    interactables: moduleDefinition.content.interactables,
    tasks: moduleDefinition.content.tasks,
    dialogues,
  };
}

