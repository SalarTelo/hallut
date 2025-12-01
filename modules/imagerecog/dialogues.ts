/**
 * Imagerecog-modul Dialoger
 * Alla dialogdefinitioner för modulen
 */

import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';
import { DIALOGUE_IDS, TASK_IDS, FUNCTION_NAMES } from './constants.js';

/**
 * Alla dialoger för modulen
 * 
 * Dialogstruktur:
 * - speaker: Namn på talaren
 * - lines: Array med dialograder
 * - choices: Valfri array med val och åtgärder
 * 
 * Val-åtgärder:
 * - { type: 'accept-task', taskId: string }
 * - { type: 'set-state', key: string, value: unknown }
 * - { type: 'function', functionName: string }
 * - null (fortsätt bara)
 */
export const dialogues: ModuleConfig['dialogues'] = {
  [DIALOGUE_IDS.GUIDE_GREETING]: {
    speaker: 'Guide',
    lines: [
      'Hej, resenär!',
      'Jag ser att du har hittat hit.',
      'Det finns mycket att utforska och lära sig.',
    ],
    choices: [
      {
        text: 'Berätta mer',
        action: null,
      },
    ],
  },

  [DIALOGUE_IDS.GUIDE_TASK_OFFER]: {
    speaker: 'Guide',
    lines: [
      'Jag har en uppgift till dig.',
      'Vill du prova?',
    ],
    choices: [
      {
        text: 'Ja, jag provar',
        action: { type: 'accept-task', taskId: TASK_IDS.EXAMPLE },
      },
      {
        text: 'Inte just nu',
        action: { type: 'set-state', key: 'task_declined', value: true },
      },
    ],
  },

  [DIALOGUE_IDS.GUIDE_TASK_READY]: {
    speaker: 'Guide',
    lines: [
      'Har du slutfört uppgiften?',
      'Om du behöver hjälp finns AI-kompanjonen här för att assistera.',
    ],
    choices: [
      {
        text: 'Ja, jag är redo att skicka in',
        action: { type: 'function', functionName: FUNCTION_NAMES.SUBMIT_TASK },
      },
      {
        text: 'Inte än',
        action: null,
      },
    ],
  },

  [DIALOGUE_IDS.GUIDE_COMPLETE]: {
    speaker: 'Guide',
    lines: [
      'Utmärkt arbete!',
      'Du har slutfört allt här.',
      'Lycka till på din resa!',
    ],
    choices: [
      {
        text: 'Tack!',
        action: null,
      },
    ],
  },
};
