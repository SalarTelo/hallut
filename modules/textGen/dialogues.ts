/**
 * Exempelmodul Dialoger
 * Alla dialogdefinitioner för exempelmodulen
 */

import type { ModuleConfig } from '../../src/types/module/moduleConfig.types.js';
import { DIALOGUE_IDS, TASK_IDS, FUNCTION_NAMES } from './constants.js';

/**
 * Alla dialoger för exempelmodulen
 */
export const dialogues: ModuleConfig['dialogues'] = {
  [DIALOGUE_IDS.GUARD_GREETING]: {
    speaker: 'Vakt',
    lines: [
      'Halt! Vem där?',
      'Jag kan inte släppa in dig i slottet förrän du har hjälpt mig med några saker.',
      'Jag har två uppgifter till dig. Slutför dem så får du passera.',
    ],
    choices: [
      {
        text: 'Fortsätt',
        action: null,
      },
    ],
  },
  [DIALOGUE_IDS.GUARD_TASK1_OFFER]: {
    speaker: 'Vakt',
    lines: [
      'Min första förfrågan handlar om en berättelse.',
      'Min mamma brukade berätta en gammal historia för mig vid sänggåendet när jag var barn.',
      'Jag vill berätta den här historien för min egen son, men jag minns bara fragment:',
      'början, några delar av mitten, och slutet.',
      'Kan du hjälpa mig skapa en sammanhängande berättelse som kopplar ihop dessa fragment?',
    ],
    choices: [
      {
        text: 'Ja, jag hjälper dig med berättelsen.',
        action: { type: 'accept-task', taskId: TASK_IDS.STORY },
      },
      {
        text: 'Inte just nu.',
        action: { type: 'set-state', key: 'task1_declined', value: true },
      },
    ],
  },
  [DIALOGUE_IDS.GUARD_TASK1_READY]: {
    speaker: 'Vakt',
    lines: [
      'Har du skrivit klart berättelsen?',
      'Om du behöver hjälp finns det en AI-kompanjon i närheten som kan assistera dig.',
    ],
    choices: [
      {
        text: 'Ja, jag är redo att skicka in.',
        action: { type: 'function', functionName: FUNCTION_NAMES.SUBMIT_TASK },
      },
      {
        text: 'Inte än.',
        action: null,
      },
    ],
  },
  [DIALOGUE_IDS.GUARD_TASK2_OFFER]: {
    speaker: 'Vakt',
    lines: [
      'Tack för hjälpen med berättelsen! Min son kommer att älska den.',
      'Nu till min andra tjänst...',
      'Min fru och jag vill ha en romantisk middag ikväll.',
      'Kan du kolla vad som finns i vårt kylskåp och föreslå ett recept?',
      'Kylskåpet står där borta - du kan kolla vilka ingredienser vi har.',
    ],
    choices: [
      {
        text: 'Ja, jag hjälper dig med receptet.',
        action: { type: 'accept-task', taskId: TASK_IDS.RECIPE },
      },
      {
        text: 'Inte just nu.',
        action: { type: 'set-state', key: 'task2_declined', value: true },
      },
    ],
  },
  [DIALOGUE_IDS.GUARD_TASK2_READY]: {
    speaker: 'Vakt',
    lines: [
      'Har du kommit på ett recept till vår romantiska middag?',
      'Om du har kollat i kylskåpet är jag redo att höra ditt förslag.',
    ],
    choices: [
      {
        text: 'Ja, jag är redo att skicka in.',
        action: { type: 'function', functionName: FUNCTION_NAMES.SUBMIT_TASK },
      },
      {
        text: 'Inte än.',
        action: null,
      },
    ],
  },
  [DIALOGUE_IDS.GUARD_COMPLETE]: {
    speaker: 'Vakt',
    lines: [
      'Utmärkt! Tack för all din hjälp.',
      'Du har varit mycket vänlig. Du får nu passera in i slottet.',
      'Lycka till på resan!',
    ],
    choices: [
      {
        text: 'Tack!',
        action: null,
      },
    ],
  },
};
