/**
 * Example Module Tasks
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '../../../src/utils/builders/tasks.js';

/**
 * Example task: Write a greeting
 */
export const greetingTask = createTask({
  id: 'greeting',
  name: 'Write a Greeting',
  description: 'Write a friendly greeting message.',
  submission: textSubmission(),
  validate: textLengthValidator(10, (text) => {
    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      return success('greeting_found', 'Great! You included a greeting.', 100);
    }
    return failure('no_greeting', 'Your message should include a greeting like "hello" or "hi".');
  }),
  overview: {
    requirements: 'Write at least 10 characters',
    goals: ['Include a greeting word', 'Make it friendly'],
  },
});

/**
 * All tasks
 */
export const tasks = [greetingTask];

