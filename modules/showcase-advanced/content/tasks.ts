/**
 * Showcase: Advanced - Tasks
 * 
 * Tasks demonstrating advanced features.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/task/index.js';

/**
 * Advanced Task
 * 
 * Demonstrates tasks in password-protected modules.
 */
export const advancedTask = createTask({
  id: 'advanced-task',
  name: 'Advanced Task',
  description: 'Write about advanced features (at least 20 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(20, (text) => {
    if (text.length >= 20) {
      return success('complete', 'Great! You understand advanced features.', 100);
    }
    return failure('too_short', 'Please write at least 20 characters.');
  }),
  overview: {
    requirements: 'Write at least 20 characters',
    goals: ['Demonstrate advanced features'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have an advanced task for you.'],
    ready: ['Ready to submit?'],
    complete: ['Excellent! You completed the advanced task.'],
  },
  meta: {
    hints: ['Write about advanced features', 'At least 20 characters'],
    examples: ['Advanced features include password locks and handlers', 'I learned about custom components'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [advancedTask];
