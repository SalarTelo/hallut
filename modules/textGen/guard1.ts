/**
 * Guard 1 - Complete Definition
 * Everything for Guard 1 in one place: tasks, dialogues, and interactable
 * 
 * This is an example of the new unified interactable system where
 * all related code (tasks, dialogues, logic) is encapsulated in one file.
 */

import { createInteractable, pos } from '../../src/utils/interactableBuilder.js';
import {
  createTypeSafeTask,
  textSubmission,
  createTextTaskValidator,
  success,
  failure,
} from '../../src/utils/typeSafeTaskBuilders.js';
import { choice } from '../../src/utils/choiceBuilder.js';
import { createDialogue } from '../../src/utils/dialogueBuilder.js';
import type { ModuleContext } from '../../src/types/core/moduleClass.types.js';
import type { TextTaskSubmission } from '../../src/types/taskTypes.js';

// ============================================================================
// TASKS
// ============================================================================

/**
 * Story Task (Text Submission)
 */
const storyTask = createTypeSafeTask<TextTaskSubmission>({
  id: 'task-1',
  name: 'Slutför berättelsen',
  description:
    'Vakten minns fragment av en godnattsaga från sin barndom. Skapa en sammanhängande berättelse som kopplar ihop början, mittdelarna och slutet.',
  submission: textSubmission({
    minLength: 200,
    maxLength: 5000,
    multiline: true,
    placeholder: 'Skriv din berättelse här...',
  }),
  solve: createTextTaskValidator((text: string) => {
    const lowerText = text.toLowerCase();
    const hasFragment1 = lowerText.includes('det var en gång');
    const hasFragment2 = lowerText.includes('drake');
    const hasFragment3 = lowerText.includes('lyckliga i alla sina dagar');

    if (hasFragment1 && hasFragment2 && hasFragment3 && text.length >= 200) {
      return success(
        'story_complete',
        'Underbart! Berättelsen kopplar ihop alla fragment på ett vackert sätt. Vakten är mycket nöjd.',
        100
      );
    }

    const missing = [];
    if (!hasFragment1) missing.push('"det var en gång"');
    if (!hasFragment2) missing.push('"drake"');
    if (!hasFragment3) missing.push('"lyckliga i alla sina dagar"');

    if (missing.length > 0) {
      return failure(
        'missing_fragments',
        `Berättelsen ska innehålla alla fragment. Saknas: ${missing.join(', ')}`
      );
    }

    return failure(
      'too_short',
      `Berättelsen behöver vara längre (minst 200 tecken). Nuvarande längd: ${text.length} tecken.`
    );
  }),
  overview: {
    requirements:
      'Skapa en sammanhängande berättelse som kopplar: "Det var en gång...", "...drake...", och "...lyckliga i alla sina dagar"',
    goals: [
      'Använd AI-kompanjonen för hjälp med berättelsen',
      'Koppla ihop alla berättelsefragment på ett sammanhängande sätt',
      'Skriv minst 200 tecken',
    ],
  },
});

/**
 * Recipe Task (Text Submission)
 */
const recipeTask = createTypeSafeTask<TextTaskSubmission>({
  id: 'task-2',
  name: 'Recept för romantisk middag',
  description:
    'Titta på kylskåpets innehåll och skapa ett recept för en romantisk middag med de tillgängliga ingredienserna.',
  submission: textSubmission({
    minLength: 100,
    multiline: true,
    placeholder: 'Skriv ditt recept här...',
  }),
  solve: createTextTaskValidator((text: string) => {
    const lowerText = text.toLowerCase();
    const hasIngredients = lowerText.includes('ingrediens') || lowerText.includes('recept');
    const hasCooking = lowerText.includes('laga') || lowerText.includes('tillaga');

    if (hasIngredients && hasCooking && text.length >= 100) {
      return success(
        'recipe_complete',
        'Perfekt! Det låter som en underbar romantisk middag. Vakten och hans fru kommer att bli förtjusta!',
        100
      );
    }

    if (!hasIngredients || !hasCooking) {
      return failure(
        'incomplete_recipe',
        'Receptet bör nämna ingredienser och hur man tillagar/lagar rätten.'
      );
    }

    return failure('too_brief', 'Vänligen ge mer detaljer om receptet och tillagningen.');
  }),
  overview: {
    requirements: 'Skapa ett recept med ingredienser från kylskåpet',
    goals: [
      'Kolla i kylskåpet för att se tillgängliga ingredienser',
      'Skapa ett recept som passar för en romantisk middag',
      'Ge detaljerade instruktioner',
    ],
  },
});

// ============================================================================
// HANDLERS
// ============================================================================

/**
 * Submit task handler
 */
const submitTaskHandler = (context: ModuleContext) => {
  const currentTaskId = context.getCurrentTaskId();
  if (currentTaskId && context.openTaskSubmission) {
    context.openTaskSubmission(currentTaskId);
  }
};

// ============================================================================
// DIALOGUES
// ============================================================================

/**
 * Greeting Dialogue
 */
const greetingDialogue = createDialogue({
  id: 'guard-greeting',
  speaker: 'Vakt',
  lines: [
    'Halt! Vem där?',
    'Jag kan inte släppa in dig i slottet förrän du har hjälpt mig med några saker.',
    'Jag har två uppgifter till dig. Slutför dem så får du passera.',
  ],
  choices: [choice('Fortsätt').build()],
});

/**
 * Task 1 Offer Dialogue
 */
const task1OfferDialogue = createDialogue({
  id: 'guard-task1-offer',
  speaker: 'Vakt',
  lines: [
    'Min första förfrågan handlar om en berättelse.',
    'Min mamma brukade berätta en gammal historia för mig vid sänggåendet när jag var barn.',
    'Jag vill berätta den här historien för min egen son, men jag minns bara fragment:',
    'början, några delar av mitten, och slutet.',
    'Kan du hjälpa mig skapa en sammanhängande berättelse som kopplar ihop dessa fragment?',
  ],
  choices: [
    choice('Ja, jag hjälper dig med berättelsen.').acceptTask(storyTask).build(),
    choice('Inte just nu.').setState('task1_declined', true).build(),
  ],
});

/**
 * Task 1 Ready Dialogue
 */
const task1ReadyDialogue = createDialogue({
  id: 'guard-task1-ready',
  speaker: 'Vakt',
  lines: [
    'Har du skrivit klart berättelsen?',
    'Om du behöver hjälp finns det en AI-kompanjon i närheten som kan assistera dig.',
  ],
  choices: [
    choice('Ja, jag är redo att skicka in.').callFunction(submitTaskHandler).build(),
    choice('Inte än.').build(),
  ],
});

/**
 * Task 2 Offer Dialogue
 */
const task2OfferDialogue = createDialogue({
  id: 'guard-task2-offer',
  speaker: 'Vakt',
  lines: [
    'Tack för hjälpen med berättelsen! Min son kommer att älska den.',
    'Nu till min andra tjänst...',
    'Min fru och jag vill ha en romantisk middag ikväll.',
    'Kan du kolla vad som finns i vårt kylskåp och föreslå ett recept?',
    'Kylskåpet står där borta - du kan kolla vilka ingredienser vi har.',
  ],
  choices: [
    choice('Ja, jag hjälper dig med receptet.').acceptTask(recipeTask).build(),
    choice('Inte just nu.').setState('task2_declined', true).build(),
  ],
});

/**
 * Task 2 Ready Dialogue
 */
const task2ReadyDialogue = createDialogue({
  id: 'guard-task2-ready',
  speaker: 'Vakt',
  lines: [
    'Har du kommit på ett recept till vår romantiska middag?',
    'Om du har kollat i kylskåpet är jag redo att höra ditt förslag.',
  ],
  choices: [
    choice('Ja, jag är redo att skicka in.').callFunction(submitTaskHandler).build(),
    choice('Inte än.').build(),
  ],
});

/**
 * Complete Dialogue
 */
const completeDialogue = createDialogue({
  id: 'guard-complete',
  speaker: 'Vakt',
  lines: [
    'Utmärkt! Tack för all din hjälp.',
    'Du har varit mycket vänlig. Du får nu passera in i slottet.',
    'Lycka till på resan!',
  ],
  choices: [choice('Tack!').build()],
});

// ============================================================================
// INTERACTABLE
// ============================================================================

/**
 * Dialogue configurations
 * Use dialogue objects directly - they're already DialogueConfig
 */
const dialogues = {
  greeting: greetingDialogue,
  'task1-offer': task1OfferDialogue,
  'task1-ready': task1ReadyDialogue,
  'task2-offer': task2OfferDialogue,
  'task2-ready': task2ReadyDialogue,
  complete: completeDialogue,
} as const;

/**
 * Guard 1 Interactable
 * Complete definition with all tasks, dialogues, and logic
 */
export const guard1 = createInteractable({
  id: 'guard',
  type: 'npc',
  name: 'Slottsvakt',
  position: pos(50, 50),
  avatar: 'shield',
  locked: false,

  // All dialogues
  dialogues,

  // Conditional dialogue routing
  getDialogue: (context: ModuleContext) => {
    // Use string IDs for backward compatibility with current context API
    const storyCompleted = context.isTaskCompleted(storyTask.id);
    const recipeCompleted = context.isTaskCompleted(recipeTask.id);
    const currentTaskId = context.getCurrentTaskId();

    // Both tasks complete
    if (storyCompleted && recipeCompleted) {
      return dialogues.complete;
    }

    // Story task active - check if ready
    if (currentTaskId === storyTask.id && !storyCompleted) {
      return dialogues['task1-ready'];
    }

    // Story complete, recipe not started - offer recipe
    if (storyCompleted && !recipeCompleted && !currentTaskId) {
      return dialogues['task2-offer'];
    }

    // Recipe task active - check if ready
    if (currentTaskId === recipeTask.id && !recipeCompleted) {
      return dialogues['task2-ready'];
    }

    // Default: offer story task
    if (!storyCompleted && !currentTaskId) {
      return dialogues['task1-offer'];
    }

    // Fallback to greeting
    return dialogues.greeting;
  },

  // Tasks this guard offers
  tasks: {
    story: storyTask,
    recipe: recipeTask,
  },

  // Handler functions
  handlers: {
    'submit-task': submitTaskHandler,
  },
});

// Export tasks for module config
export const guard1Tasks = [storyTask, recipeTask];

