/**
 * Recept-uppgift Definition
 * Uppgift för att skapa ett romantiskt middagsrecept
 */

import type { Task } from '../../../src/types/module/moduleConfig.types.js';
import type { TaskSubmission } from '../../../src/types/module/task.types.js';
import type { TaskSolveResult } from '../../../src/types/core/taskSolveResult.types.js';
import { TASK_IDS } from '../constants.js';

/**
 * Minsta receptlängd i tecken
 */
const MIN_RECIPE_LENGTH = 100;

/**
 * Nyckelord som indikerar att ingredienser nämns
 */
const INGREDIENT_KEYWORDS = ['ingrediens', 'recept', 'rätt'] as const;

/**
 * Nyckelord som indikerar att tillagningsinstruktioner nämns
 */
const COOKING_KEYWORDS = ['laga', 'tillaga', 'gör'] as const;

/**
 * Lösningsfunktion för receptuppgiften
 */
function solveRecipeTask(input: TaskSubmission): TaskSolveResult {
  if (input.type !== 'text' || !('text' in input)) {
    return {
      solved: false,
      reason: 'invalid_submission',
      details: 'Vänligen skicka in ditt recept som text.',
    };
  }

  const textValue = input.text as string;
  const text = textValue.trim().toLowerCase();
  const textLength = textValue.trim().length;

  // Kontrollera om ingredienser och tillagning nämns
  const hasIngredients = INGREDIENT_KEYWORDS.some(keyword => text.includes(keyword));
  const hasCooking = COOKING_KEYWORDS.some(keyword => text.includes(keyword));

  if (hasIngredients && hasCooking && textLength >= MIN_RECIPE_LENGTH) {
    return {
      solved: true,
      reason: 'recipe_complete',
      details: 'Perfekt! Det låter som en underbar romantisk middag. Vakten och hans fru kommer att bli förtjusta!',
      score: 100,
    };
  }

  if (!hasIngredients || !hasCooking) {
    return {
      solved: false,
      reason: 'incomplete_recipe',
      details: 'Receptet bör nämna ingredienser och hur man tillagar/lagar rätten.',
    };
  }

  if (textLength < MIN_RECIPE_LENGTH) {
    return {
      solved: false,
      reason: 'too_brief',
      details: 'Vänligen ge mer detaljer om receptet och tillagningen.',
    };
  }

  return {
    solved: false,
    reason: 'unknown_error',
    details: 'Ett oväntat fel inträffade.',
  };
}

/**
 * Receptuppgiftens definition
 */
export const recipeTask: Task = {
  id: TASK_IDS.RECIPE,
  name: 'Recept för romantisk middag',
  description: 'Titta på kylskåpets innehåll och skapa ett recept för en romantisk middag med de tillgängliga ingredienserna.',
  solveFunction: solveRecipeTask,
  submission: {
    type: 'text',
  },
  overview: {
    requirements: 'Skapa ett recept med ingredienser från kylskåpet',
    goals: [
      'Kolla i kylskåpet för att se tillgängliga ingredienser',
      'Skapa ett recept som passar för en romantisk middag',
      'Ge detaljerade instruktioner',
    ],
  },
};
