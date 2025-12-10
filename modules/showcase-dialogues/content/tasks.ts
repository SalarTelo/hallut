/**
 * Showcase: Dialogues - Tasks
 * 
 * Simple task to demonstrate task offering via dialogue.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/task/index.js';

/**
 * Dialogue Task
 * 
 * This task is offered through dialogue, demonstrating
 * how to offer tasks via dialogue trees.
 */
export const dialogueTask = createTask({
  id: 'dialogue-task',
  name: 'Dialogue Task',
  description: 'Write about dialogues (at least 15 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(15, (text) => {
    if (text.length >= 15) {
      return success('complete', 'Great! You understand dialogue-based task offering.', 100);
    }
    return failure('too_short', 'Please write at least 15 characters.');
  }),
  overview: {
    requirements: 'Write at least 15 characters',
    goals: ['Complete a task offered via dialogue'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have a task for you about dialogues.'],
    ready: ['Ready to submit?'],
    complete: ['Excellent! You completed the dialogue task.'],
  },
  meta: {
    hints: ['Write about dialogues', 'At least 15 characters'],
    examples: ['Dialogues are interactive conversations', 'I learned about dialogue trees'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [dialogueTask];
