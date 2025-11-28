/**
 * Dialogue Service
 * Handles dialogue management and generation
 * Depends on: types only
 */

import type { DialogueConfig } from '../types/dialogue.types.js';
import type { ModuleConfig } from '../types/module/moduleConfig.types.js';
import { InteractableActionType } from '../types/interactable.types.js';
import type { DialogueAction } from '../types/interactable.types.js';
import { getWelcomeDialogueId } from '../constants/module.constants.js';

/**
 * Generate dialogue configs from module config
 * Extracts dialogues from interactables and welcome
 * 
 * @param moduleConfig - Module configuration
 * @param moduleId - Module ID
 * @returns Map of dialogue ID to dialogue config
 */
export function generateDialoguesFromModule(
  moduleConfig: ModuleConfig,
  moduleId: string
): Record<string, DialogueConfig> {
  const dialogues: Record<string, DialogueConfig> = {};

  // First, load ALL dialogues from moduleConfig.dialogues (important for conditional dialogues like guard)
  if (moduleConfig.dialogues) {
    for (const [dialogueId, dialogueDef] of Object.entries(moduleConfig.dialogues)) {
      dialogues[dialogueId] = {
        id: dialogueId,
        speaker: dialogueDef.speaker,
        greeting: dialogueDef.lines,
        choices: dialogueDef.choices,
        onComplete: dialogueDef.onComplete,
      };
    }
  }

  // Create dialogue config for each interactable that has dialogue action
  // (This ensures interactable dialogues exist even if not in moduleConfig.dialogues)
  for (const interactable of moduleConfig.interactables) {
    if (interactable.action.type === InteractableActionType.Dialogue) {
      const dialogueId = (interactable.action as DialogueAction).dialogue;
      if (!dialogues[dialogueId]) {
        // If not already loaded from moduleConfig.dialogues, create from interactable
        dialogues[dialogueId] = {
          id: dialogueId,
          speaker: interactable.name,
          greeting: [],
        };
      }
    }
  }

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

