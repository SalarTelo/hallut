/**
 * Example 1: Basic Tasks
 * 
 * A single simple text task with basic validation.
 * No unlock requirements, no complex logic.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/tasks.js';

/**
 * Simple greeting task
 * 
 * This task demonstrates:
 * - Basic text submission
 * - Simple length validation
 * - Success/failure responses
 */
export const greetingTask = createTask({
  id: 'greeting',
  name: 'Write a Greeting',
  description: 'Write a friendly greeting message (at least 10 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(10, (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      return success('greeting_found', 'Great! You included a greeting.', 100);
    }
    return failure('no_greeting', 'Your message should include a greeting like "hello", "hi", or "hey".');
  }),
  overview: {
    requirements: 'Write at least 10 characters',
    goals: ['Include a greeting word'],
  },
  unlockRequirement: null, // Always available
  dialogues: {
    offer: ['I have a simple task for you if you\'re interested.'],
    ready: ['Are you ready to submit your greeting?'],
    complete: ['Excellent! You completed the task.'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [greetingTask];

