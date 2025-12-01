/**
 * Dialogue Service
 * Handles dialogue management and generation
 * Depends on: types only
 */

import type { DialogueConfig } from '../types/dialogue.types.js';
import type { ModuleConfig } from '../types/module/moduleConfig.types.js';
import { getWelcomeDialogueId } from '../constants/module.constants.js';
import type { Interactable } from '../types/interactable.types.js';
import { extractDialogues as extractDialoguesFromUnified } from '../utils/interactableBuilder.js';

/**
 * Generate dialogue configs from module config
 * Extracts dialogues from interactables and welcome
 * Supports both unified interactables and regular interactables
 * 
 * @param moduleConfig - Module configuration
 * @param moduleId - Module ID
 * @param interactables - Optional interactables (if using new system)
 * @returns Map of dialogue ID to dialogue config
 */
export function generateDialoguesFromModule(
  moduleConfig: ModuleConfig,
  moduleId: string,
  interactables?: Interactable[]
): Record<string, DialogueConfig> {
  const dialogues: Record<string, DialogueConfig> = {};

  // If interactables provided, extract from them
  if (interactables) {
    const extracted = extractDialoguesFromUnified(interactables);
    Object.assign(dialogues, extracted);
  }

  // First, load ALL dialogues from moduleConfig.dialogues (important for conditional dialogues like guard)
  if (moduleConfig.dialogues) {
    for (const [dialogueId, dialogueDef] of Object.entries(moduleConfig.dialogues)) {
      dialogues[dialogueId] = {
        id: dialogueId,
        speaker: dialogueDef.speaker,
        greeting: dialogueDef.lines,
        choices: dialogueDef.choices,
      };
    }
  }

  // Dialogues from new Interactable type are already extracted above via extractDialogues
  // No need to process interactables here since they use dialogues directly

  // If module has welcome, create welcome dialogue
  if (moduleConfig.welcome) {
    const welcomeDialogueId = getWelcomeDialogueId(moduleId);
    dialogues[welcomeDialogueId] = {
      id: welcomeDialogueId,
      speaker: moduleConfig.welcome.speaker,
      greeting: moduleConfig.welcome.lines,
    };
  }

  return dialogues;
}

/**
 * Get dialogue config by ID
 * 
 * @param dialogues - Map of dialogues
 * @param dialogueId - Dialogue ID
 * @returns Dialogue config or null
 */
export function getDialogueConfig(
  dialogues: Record<string, DialogueConfig>,
  dialogueId: string
): DialogueConfig | null {
  return dialogues[dialogueId] || null;
}

