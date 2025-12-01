/**
 * Berättelse-uppgift Definition
 * Uppgift för att slutföra vaktens barndomsberättelse
 */

import type { Task } from '../../../src/types/module/moduleConfig.types.js';
import type { TaskSubmission } from '../../../src/types/module/task.types.js';
import type { TaskSolveResult } from '../../../src/types/core/taskSolveResult.types.js';
import { TASK_IDS } from '../constants.js';

/**
 * Obligatoriska berättelsefragment
 */
const REQUIRED_FRAGMENTS = [
  'det var en gång',
  'drake',
  'lyckliga i alla sina dagar',
] as const;

/**
 * Minsta berättelselängd i tecken
 */
const MIN_STORY_LENGTH = 200;

/**
 * Lösningsfunktion för berättelseuppgiften
 */
function solveStoryTask(input: TaskSubmission): TaskSolveResult {
  if (input.type !== 'text' || !('text' in input)) {
    return {
      solved: false,
      reason: 'invalid_submission',
      details: 'Vänligen skicka in din berättelse som text.',
    };
  }

  const textValue = input.text as string;
  const text = textValue.trim();
  const lowerText = text.toLowerCase();

  // Kontrollera att ALLA fragment finns med
  const hasAllFragments = REQUIRED_FRAGMENTS.every(fragment => lowerText.includes(fragment));
  const isLongEnough = text.length >= MIN_STORY_LENGTH;

  // Kontrollera vilka fragment som saknas för bättre felmeddelanden
  const missingFragments = REQUIRED_FRAGMENTS.filter(fragment => !lowerText.includes(fragment));

  if (hasAllFragments && isLongEnough) {
    return {
      solved: true,
      reason: 'story_complete',
      details: 'Underbart! Berättelsen kopplar ihop alla fragment på ett vackert sätt. Vakten är mycket nöjd.',
      score: 100,
    };
  }

  // Ge specifik feedback
  if (!hasAllFragments) {
    const missingText = missingFragments.length === 1
      ? `"${missingFragments[0]}"`
      : missingFragments.map(f => `"${f}"`).join(', ');
    return {
      solved: false,
      reason: 'missing_fragments',
      details: `Berättelsen ska innehålla alla fragment. Saknas: ${missingText}`,
    };
  }

  if (!isLongEnough) {
    return {
      solved: false,
      reason: 'too_short',
      details: `Berättelsen behöver vara längre (minst ${MIN_STORY_LENGTH} tecken). Nuvarande längd: ${text.length} tecken. Försök lägga till fler detaljer för att koppla ihop fragmenten.`,
    };
  }

  return {
    solved: false,
    reason: 'unknown_error',
    details: 'Ett oväntat fel inträffade.',
  };
}

/**
 * Berättelseuppgiftens definition
 */
export const storyTask: Task = {
  id: TASK_IDS.STORY,
  name: 'Slutför berättelsen',
  description: 'Vakten minns fragment av en godnattsaga från sin barndom. Skapa en sammanhängande berättelse som kopplar ihop början, mittdelarna och slutet.',
  solveFunction: solveStoryTask,
  submission: {
    type: 'text',
  },
  overview: {
    requirements: 'Skapa en sammanhängande berättelse som kopplar: "Det var en gång...", "...drake...", och "...lyckliga i alla sina dagar"',
    goals: [
      'Använd AI-kompanjonen för hjälp med berättelsen',
      'Koppla ihop alla berättelsefragment på ett sammanhängande sätt',
      'Skriv minst 200 tecken',
    ],
  },
};
