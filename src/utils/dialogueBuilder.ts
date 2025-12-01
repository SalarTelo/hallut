/**
 * Dialogue Builder
 * Builder for creating dialogues with type-safe choice system
 */

import type { DialogueConfig } from '../types/dialogue.types.js';
import type { DialogueChoice } from '../types/choiceTypes.js';

/**
 * Dialogue options
 */
export interface DialogueOptions {
  id: string;
  speaker: string;
  lines: string[];
  choices?: DialogueChoice[];
}

/**
 * Create a dialogue with type-safe choices
 * Uses DialogueChoice directly - no conversion needed
 * 
 * @param options - Dialogue configuration
 * @returns Dialogue config
 */
export function createDialogue(
  options: DialogueOptions
): DialogueConfig {
  const { id, speaker, lines, choices } = options;

  return {
    id,
    speaker,
    greeting: lines,
    choices, // Use directly - no conversion needed
  };
}

