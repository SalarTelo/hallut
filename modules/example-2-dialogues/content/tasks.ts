/**
 * Example 2: Dialogues Tasks
 * 
 * A simple task that is offered through dialogue.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/task/index.js';

/**
 * Reflection Task
 * 
 * This task is offered through dialogue, not directly.
 */
export const reflectionTask = createTask({
  id: 'reflection',
  name: 'Reflection',
  description: 'Write a short reflection (at least 20 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(20, (text) => {
    if (text.length >= 20) {
      return success('complete', 'Good reflection!', 100);
    }
    return failure('too_short', 'Please write at least 20 characters.');
  }),
  overview: {
    requirements: 'Write at least 20 characters',
    goals: ['Complete the reflection'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have a reflection task for you.'],
    ready: ['Are you ready to submit your reflection?'],
    complete: ['Great work on your reflection!'],
  },
  meta: {
    hints: ['Think about what you learned or experienced', 'Write at least 20 characters to complete the reflection'],
    examples: ['I learned that dialogue trees can guide players through tasks.', 'This module showed me how NPCs can offer tasks through conversation.'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [reflectionTask];

