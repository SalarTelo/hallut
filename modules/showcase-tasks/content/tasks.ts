/**
 * Showcase: Tasks - All Task Types
 * 
 * Demonstrates all available task types and validators.
 */

import {
  createTask,
  textSubmission,
  multipleChoiceSubmission,
  customSubmission,
  textLengthValidator,
  wordCountValidator,
  keywordsValidator,
  success,
  failure,
} from '@builders/task/index.js';

/**
 * Text Task with Length Validator
 * 
 * Demonstrates:
 * - textSubmission()
 * - textLengthValidator()
 */
export const textLengthTask = createTask({
  id: 'text-length',
  name: 'Text Task',
  description: 'Write a message about tasks (at least 20 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(20, (text) => {
    if (text.length >= 20) {
      return success('complete', 'Great! You wrote enough characters.', 100);
    }
    return failure('too_short', 'Please write at least 20 characters.');
  }),
  overview: {
    requirements: 'Write at least 20 characters',
    goals: ['Demonstrate text length validation'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have a text task with length validation.'],
    ready: ['Ready to submit?'],
    complete: ['Excellent! Text length validation works.'],
  },
  meta: {
    hints: ['Write at least 20 characters', 'Write about tasks'],
    examples: ['Tasks are activities that users solve', 'I am learning about task types'],
  },
});

/**
 * Text Task with Word Count Validator
 * 
 * Demonstrates:
 * - wordCountValidator()
 */
export const wordCountTask = createTask({
  id: 'word-count',
  name: 'Text Task',
  description: 'Write a description using at least 5 words.',
  submission: textSubmission(),
  validate: wordCountValidator(5, (text, wordCount) => {
    // wordCountValidator already checked minimum, so we can just return success
    return success('complete', `Great! You used ${wordCount} words.`, 100);
  }),
  overview: {
    requirements: 'Write at least 5 words',
    goals: ['Demonstrate word count validation'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have a text task with word count validation.'],
    ready: ['Ready to submit?'],
    complete: ['Excellent! Word count validation works.'],
  },
  meta: {
    hints: ['Use at least 5 words', 'Separate words with spaces'],
    examples: ['This is a test task with words', 'I am learning about validators'],
  },
});

/**
 * Text Task with Keywords Validator
 * 
 * Demonstrates:
 * - keywordsValidator()
 */
export const keywordsTask = createTask({
  id: 'keywords',
  name: 'Text Task',
  description: 'Write about tasks and include the word "task" or "activity".',
  submission: textSubmission(),
  validate: keywordsValidator(['task', 'activity'], (text, foundKeywords) => {
    // keywordsValidator already checked for keywords, so we can just return success
    return success('complete', `Great! You included: ${foundKeywords.join(', ')}.`, 100);
  }),
  overview: {
    requirements: 'Include "task" or "activity"',
    goals: ['Demonstrate keyword validation'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have a text task with keyword validation.'],
    ready: ['Ready to submit?'],
    complete: ['Excellent! Keyword validation works.'],
  },
  meta: {
    hints: ['Include the word "task" or "activity"', 'Write at least a few words'],
    examples: ['This is a task about learning', 'I like this activity'],
  },
});

/**
 * Multiple Choice Task
 * 
 * Demonstrates:
 * - multipleChoiceSubmission()
 */
export const multipleChoiceTask = createTask({
  id: 'multiple-choice',
  name: 'Multiple Choice Task',
  description: 'Which task type allows users to select from predefined options?',
  submission: multipleChoiceSubmission([
    'Text Task',
    'Multiple Choice Task',
    'Custom Task',
  ]),
  validate: (input) => {
    if (input.type === 'multiple_choice' && input.choice === 'Multiple Choice Task') {
      return success('correct', 'Correct! Multiple choice tasks allow selection from options.', 100);
    }
    return failure('incorrect', 'Not quite. Try again!');
  },
  overview: {
    requirements: 'Select the correct option',
    goals: ['Demonstrate multiple choice tasks'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have a multiple choice question for you.'],
    ready: ['Ready to answer?'],
    complete: ['Excellent! You understand multiple choice tasks.'],
  },
  meta: {
    hints: ['Read the question carefully', 'Think about what each task type does'],
    examples: [],
  },
});

/**
 * Custom Submission Task
 * 
 * Demonstrates:
 * - customSubmission() with a custom component
 */
export const customTask = createTask({
  id: 'custom',
  name: 'Custom Submission Task',
  description: 'This demonstrates custom submission components with a unique interface.',
  submission: customSubmission('CustomTaskSubmission', {
    instruction: 'Select your favorite color and enter a reason',
  }),
  validate: (input) => {
    // Custom validation logic
    if (input.type === 'custom' && input.data) {
      const data = input.data as { color?: string; reason?: string };
      if (data.color && data.reason && data.reason.length >= 10) {
        return success('complete', `Great! You chose ${data.color} because: ${data.reason}`, 100);
      }
      return failure('incomplete', 'Please select a color and provide a reason (at least 10 characters).');
    }
    return failure('invalid', 'Please complete the custom submission.');
  },
  overview: {
    requirements: 'Select a color and provide a reason (at least 10 characters)',
    goals: ['Demonstrate custom submission components'],
  },
  unlockRequirement: null,
  dialogues: {
    offer: ['I have a custom submission task for you.'],
    ready: ['Ready to submit?'],
    complete: ['Excellent! Custom submission works.'],
  },
  meta: {
    hints: ['Use the custom component', 'Select a color and write a reason'],
    examples: [],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [
  textLengthTask,
  wordCountTask,
  keywordsTask,
  multipleChoiceTask,
  customTask,
];
