/**
 * Showcase: Basics - Tasks
 * 
 * Demonstrates basic task creation with simple validation.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/task/index.js';

/**
 * Basic Text Task
 * 
 * Demonstrates:
 * - Basic text submission
 * - Simple length validation
 * - Success/failure responses
 */
export const basicTask = createTask({
  id: 'basic-task',
  name: 'Basic Text Task',
  description: 'Write a simple message (at least 10 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(10, (text) => {
    if (text.length >= 10) {
      return success('complete', 'Great! You completed a basic task.', 100);
    }
    return failure('too_short', 'Please write at least 10 characters.');
  }),
  overview: {
    requirements: 'Write at least 10 characters',
    goals: ['Complete a basic task'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have a simple task for you.'],
    ready: ['Ready to submit?'],
    complete: ['Excellent! You completed the basic task.'],
  },
  meta: {
    hints: ['Write at least 10 characters', 'Any message will do'],
    examples: ['Hello, this is a test', 'I am learning module creation'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [basicTask];
