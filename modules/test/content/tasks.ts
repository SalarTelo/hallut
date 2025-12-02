/**
 * Module Tasks
 * 
 * Define all tasks for this module here.
 * Tasks are learning objectives that players complete.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@utils/builders/tasks.js';

/**
 * Example task: Write a greeting
 * 
 * This is an example task demonstrating the basic structure.
 * TODO: Replace with your own tasks.
 */
export const exampleTask = createTask({
  id: 'example',
  name: 'Example Task',
  description: 'This is an example task. Replace with your own.',
  submission: textSubmission(),
  validate: textLengthValidator(10, (text) => {
    // TODO: Add your custom validation logic here
    if (text.length >= 10) {
      return success('task_complete', 'Great job!', 100);
    }
    return failure('too_short', 'Please write at least 10 characters.');
  }),
  overview: {
    requirements: 'Write at least 10 characters',
    goals: ['Complete the example task'],
  },
  unlockRequirement: null, // No requirement - always available
  dialogues: {
    offer: ['I have a task for you if you\'re interested.'],
    ready: ['Are you ready to submit your task?'],
    complete: ['Excellent work! You have completed the task.'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [exampleTask];
