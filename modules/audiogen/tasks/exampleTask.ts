/**
 * Exempeluppgift Definition
 * Använd denna som mall för att skapa nya uppgifter
 */

import type { Task } from '../../../src/types/module/moduleConfig.types.js';
import type { TaskSubmission } from '../../../src/types/module/task.types.js';
import type { TaskSolveResult } from '../../../src/types/core/taskSolveResult.types.js';
import { TASK_IDS } from '../constants.js';

/**
 * Minsta textlängd som krävs
 */
const MIN_LENGTH = 100;

/**
 * Lösningsfunktion - validerar inskickningen
 * 
 * @param input - Uppgiftsinskickningen
 * @returns Lösningsresultat med framgång/misslyckande och feedback
 */
function solveExampleTask(input: TaskSubmission): TaskSolveResult {
  // Kontrollera inskickningstyp
  if (input.type !== 'text' || !('text' in input)) {
    return {
      solved: false,
      reason: 'invalid_submission',
      details: 'Vänligen skicka in ditt svar som text.',
    };
  }

  const text = (input.text as string).trim();

  // Kontrollera längd
  if (text.length < MIN_LENGTH) {
    return {
      solved: false,
      reason: 'too_short',
      details: `Ditt svar behöver vara längre. Minimum: ${MIN_LENGTH} tecken. Nuvarande: ${text.length} tecken.`,
    };
  }

  // Lägg till din egen valideringslogik här
  // Till exempel, kontrollera obligatoriska nyckelord, mönster etc.

  return {
    solved: true,
    reason: 'complete',
    details: 'Bra jobbat! Du har slutfört uppgiften.',
    score: 100,
  };
}

/**
 * Exempeluppgiftens definition
 */
export const exampleTask: Task = {
  id: TASK_IDS.EXAMPLE,
  name: 'Exempeluppgift',
  description: `Detta är en exempeluppgift. Skriv minst ${MIN_LENGTH} tecken för att slutföra den.`,
  solveFunction: solveExampleTask,
  submission: {
    type: 'text',
  },
  overview: {
    requirements: `Skriv minst ${MIN_LENGTH} tecken.`,
    goals: [
      'Öva på att använda uppgiftssystemet',
      'Få hjälp av AI-kompanjonen vid behov',
    ],
  },
};
