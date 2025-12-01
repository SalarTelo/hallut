/**
 * Modulkonstanter
 * Centraliserade ID:n och funktionsnamn för typsäkerhet
 */

/**
 * Interaktiva objekt-ID:n
 * Lägg till dina interaktiva objekt-ID:n här
 */
export const INTERACTABLE_IDS = {
  GUIDE: 'guide',
  AI_COMPANION: 'ai-companion',
  // Lägg till fler interaktiva objekt här
} as const;

/**
 * Uppgifts-ID:n
 * Lägg till dina uppgifts-ID:n här
 */
export const TASK_IDS = {
  EXAMPLE: 'task-1',
  // Lägg till fler uppgifter här
} as const;

/**
 * Dialog-ID:n
 * Lägg till dina dialog-ID:n här
 */
export const DIALOGUE_IDS = {
  GUIDE_GREETING: 'guide-greeting',
  GUIDE_TASK_OFFER: 'guide-task-offer',
  GUIDE_TASK_READY: 'guide-task-ready',
  GUIDE_COMPLETE: 'guide-complete',
  // Lägg till fler dialoger här
} as const;

/**
 * Funktionsnamn för interaktiva objekthanterare
 */
export const FUNCTION_NAMES = {
  GUIDE_INTERACT: 'guide-interact',
  SUBMIT_TASK: 'submit-task',
  // Lägg till fler funktioner här
} as const;
