/**
 * Intro-modul Interaktiva objekt
 * Alla definitioner för interaktiva objekt (NPC:er, föremål etc.)
 */

import type { Interactable } from '../../src/types/interactable.types.js';
import { InteractableActionType, taskComplete } from '../../src/types/interactable.types.js';
import { INTERACTABLE_IDS, TASK_IDS, FUNCTION_NAMES } from './constants.js';

/**
 * Guide-NPC - huvudsaklig interaktionspunkt
 * Använder funktionsåtgärd för villkorlig dialog
 */
export const guideInteractable: Interactable = {
  id: INTERACTABLE_IDS.GUIDE,
  type: 'npc',
  name: 'Guide',
  position: { x: 50, y: 50 },
  avatar: '🧑‍🏫',
  locked: false,
  unlockRequirement: null,
  action: {
    type: InteractableActionType.Function,
    function: FUNCTION_NAMES.GUIDE_INTERACT,
  },
};

/**
 * AI-kompanjon - hjälper med uppgifter
 */
export const aiCompanionInteractable: Interactable = {
  id: INTERACTABLE_IDS.AI_COMPANION,
  type: 'object',
  name: 'AI-kompanjon',
  position: { x: 25, y: 40 },
  avatar: '🤖',
  locked: false,
  unlockRequirement: null,
  action: {
    type: InteractableActionType.Chat,
  },
};

/**
 * Alla interaktiva objekt för modulen
 */
export const interactables: Interactable[] = [
  guideInteractable,
  aiCompanionInteractable,
];
