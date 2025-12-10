/**
 * Showcase: Objects - Tasks
 * 
 * Task to unlock the locked object.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/task/index.js';

/**
 * Unlock Task
 * 
 * This task unlocks the locked object when completed.
 */
export const unlockTask = createTask({
  id: 'unlock-object',
  name: 'Unlock the Locked Object',
  description: 'Write "unlock" to unlock the locked object (at least 6 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(6, (text) => {
    const lowerText = text.toLowerCase().trim();
    if (lowerText.includes('unlock')) {
      return success('complete', 'Great! The locked object is now unlocked.', 100);
    }
    return failure('missing_keyword', 'Your answer should include the word "unlock".');
  }),
  overview: {
    requirements: 'Write at least 6 characters including "unlock"',
    goals: ['Unlock the locked object'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have a task that will unlock a special object.'],
    ready: ['Ready to unlock the object?'],
    complete: ['Excellent! The locked object is now available.'],
  },
  meta: {
    hints: ['Include the word "unlock"', 'Write at least 6 characters'],
    examples: ['I want to unlock the object', 'Let me unlock it'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [unlockTask];
