/**
 * Exempelmodul Interaktiva objekt
 * Alla definitioner för interaktiva objekt i exempelmodulen
 */

import type { Interactable } from '../../src/types/interactable.types.js';
import { InteractableActionType, taskComplete } from '../../src/types/interactable.types.js';
import { INTERACTABLE_IDS, TASK_IDS, FUNCTION_NAMES } from './constants.js';

/**
 * Vakt-NPC interaktivt objekt
 */
export const guardInteractable: Interactable = {
  id: INTERACTABLE_IDS.GUARD,
  type: 'npc',
  name: 'Slottsvakt',
  position: { x: 50, y: 50 },
  avatar: 'shield',
  locked: false,
  unlockRequirement: null,
  action: {
    type: InteractableActionType.Function,
    function: FUNCTION_NAMES.GUARD_INTERACT,
  },
};

/**
 * AI-kompanjon interaktivt objekt
 */
export const aiCompanionInteractable: Interactable = {
  id: INTERACTABLE_IDS.AI_COMPANION,
  type: 'object',
  name: 'AI-kompanjon',
  position: { x: 25, y: 40 },
  avatar: 'chat',
  locked: false,
  unlockRequirement: null,
  action: {
    type: InteractableActionType.Chat,
  },
};

/**
 * Kylskåp interaktivt objekt (låses upp efter berättelseuppgiften)
 */
export const fridgeInteractable: Interactable = {
  id: INTERACTABLE_IDS.FRIDGE,
  type: 'object',
  name: 'Kylskåp',
  position: { x: 75, y: 40 },
  avatar: 'box',
  locked: true,
  unlockRequirement: taskComplete(TASK_IDS.STORY),
  action: {
    type: InteractableActionType.Image,
    imageUrl: '/fridge.jpg',
    title: 'Kylskåpets innehåll',
  },
};

/**
 * Magisk spegel - analyserar bilder med AI
 */
export const magicMirrorInteractable: Interactable = {
  id: INTERACTABLE_IDS.MAGIC_MIRROR,
  type: 'object',
  name: 'Magisk spegel',
  position: { x: 50, y: 70 },
  avatar: 'star',
  locked: false,
  unlockRequirement: null,
  action: {
    type: InteractableActionType.ImageAnalysis,
    analysisPrompt: 'Beskriv vad du ser i denna bild på svenska. Var detaljerad och beskriv atmosfären, färger och känsla.',
  },
};

/**
 * Alla interaktiva objekt för exempelmodulen
 */
export const interactables: Interactable[] = [
  guardInteractable,
  aiCompanionInteractable,
  fridgeInteractable,
  magicMirrorInteractable,
];
