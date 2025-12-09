/**
 * Example 3: Progression Tasks
 * 
 * Demonstrates a task chain where each task unlocks the next.
 */

import {
  createTask,
  textSubmission,
  multipleChoiceSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/task/index.js';
import { taskComplete } from '@builders/interactable/index.js';

/**
 * Task 1: Introduction
 * Always available - no unlock requirement
 */
export const introTask = createTask({
  id: 'intro',
  name: 'Introduction',
  description: 'Write a short introduction about yourself (at least 20 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(20, (text) => {
    if (text.length >= 20) {
      return success('complete', 'Nice introduction!', 100);
    }
    return failure('too_short', 'Please write at least 20 characters.');
  }),
  overview: {
    requirements: 'Write at least 20 characters',
    goals: ['Complete the introduction'],
  },
  unlockRequirement: null, // Always available
  dialogues: {
    offer: ['Let\'s start with a simple introduction task.'],
    ready: ['Ready to submit your introduction?'],
    complete: ['Great! Now you can move on to the next task.'],
  },
});

/**
 * Task 2: Quiz
 * Locked until Task 1 is completed
 */
export const quizTask = createTask({
  id: 'quiz',
  name: 'Quick Quiz',
  description: 'What is the capital of France?',
  submission: multipleChoiceSubmission([
    'London',
    'Paris',
    'Berlin',
    'Madrid',
  ]),
  validate: (input) => {
    if (input.type === 'multiple_choice' && input.choice === 'Paris') {
      return success('correct', 'Correct! Paris is the capital of France.', 100);
    }
    return failure('incorrect', 'Not quite. Try again!');
  },
  overview: {
    requirements: 'Select the correct answer',
    goals: ['Answer the quiz correctly'],
  },
  unlockRequirement: taskComplete(introTask), // Locked until introTask is completed
  dialogues: {
    offer: ['Now that you\'ve introduced yourself, let\'s test your knowledge!'],
    ready: ['Ready to answer the quiz?'],
    complete: ['Excellent! You\'ve unlocked the final task.'],
  },
});

/**
 * Task 3: Reflection
 * Locked until Task 2 is completed
 */
export const reflectionTask = createTask({
  id: 'reflection',
  name: 'Final Reflection',
  description: 'Write a reflection on what you learned (at least 30 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(30, (text) => {
    if (text.length >= 30) {
      return success('complete', 'Great reflection! You\'ve completed all tasks.', 100);
    }
    return failure('too_short', 'Please write at least 30 characters.');
  }),
  overview: {
    requirements: 'Write at least 30 characters',
    goals: ['Complete the reflection'],
  },
  unlockRequirement: taskComplete(quizTask), // Locked until quizTask is completed
  dialogues: {
    offer: ['For the final task, write a reflection.'],
    ready: ['Ready to submit your reflection?'],
    complete: ['Congratulations! You\'ve completed all tasks in this module!'],
  },
});

/**
 * Task 4: Module Unlock
 * Locked until Task 3 (reflection) is completed
 * This task unlocks Module 3A when completed
 */
export const module3UnlockTask = createTask({
  id: 'module-unlock',
  name: 'Unlock New Module',
  description: 'Complete this task to unlock a new module! Write "unlock" (at least 6 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(6, (text) => {
    const lowerText = text.toLowerCase().trim();
    if (lowerText.includes('unlock')) {
      return success('complete', 'Excellent! You\'ve unlocked a new module on the worldmap!', 100);
    }
    return failure('missing_keyword', 'Your answer should include the word "unlock".');
  }),
  overview: {
    requirements: 'Write at least 6 characters including "unlock"',
    goals: ['Include the word "unlock" in your answer'],
  },
  unlockRequirement: taskComplete(reflectionTask), // Locked until reflectionTask is completed
  dialogues: {
    offer: ['Complete this special task to unlock a new module!'],
    ready: ['Ready to unlock a new module?'],
    complete: ['Amazing! Check the worldmap - a new module has been unlocked!'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [introTask, quizTask, reflectionTask, module3UnlockTask];

