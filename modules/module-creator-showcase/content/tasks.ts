/**
 * Module Creator Showcase - Hub Tasks
 * 
 * Tasks for the hub module that unlock submodules when completed.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/task/index.js';

/**
 * Exploration Task
 * 
 * This task unlocks all showcase submodules when completed.
 * It demonstrates basic task creation and validation.
 */
export const explorationTask = createTask({
  id: 'exploration',
  name: 'Explore the Showcase',
  description: 'Write "explore" to unlock all showcase submodules (at least 7 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(7, (text) => {
    // textLengthValidator already checked length >= 7, so we just check for keyword
    const lowerText = text.toLowerCase().trim();
    if (lowerText.includes('explore')) {
      return success('complete', 'Excellent! All showcase submodules are now unlocked. Check the worldmap!', 100);
    }
    return failure('missing_keyword', 'Your answer should include the word "explore".');
  }),
  overview: {
    requirements: 'Write at least 7 characters including "explore"',
    goals: ['Unlock all showcase submodules'],
  },
  unlockRequirement: null, // Always available
  dialogues: {
    offer: ['I have an exploration task for you. Complete it to unlock all showcase submodules!'],
    ready: ['Ready to explore and unlock the submodules?'],
    complete: ['Great! All showcase submodules are now available on the worldmap!'],
  },
  meta: {
    hints: ['Include the word "explore" in your answer', 'Write at least 7 characters'],
    examples: ['I want to explore the showcase', 'Let me explore all the features'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [explorationTask];
