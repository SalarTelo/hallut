/**
 * Example 3A: Task Unlock Module Tasks
 * 
 * Simple task demonstrating this is an unlockable module.
 */

import {
  createTask,
  textSubmission,
  textLengthValidator,
  success,
  failure,
} from '@builders/task/index.js';
import { taskComplete } from '@builders/interactable/index.js';

/**
 * Task 1: Welcome Task
 * Always available - first task in unlocked module
 */
export const welcomeTask = createTask({
  id: 'welcome',
  name: 'Welcome Task',
  description: 'Write a message about unlocking this module (at least 15 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(15, (text) => {
    if (text.length >= 15) {
      return success('complete', 'Great! You\'ve completed a task in an unlocked module!', 100);
    }
    return failure('too_short', 'Please write at least 15 characters.');
  }),
  overview: {
    requirements: 'Write at least 15 characters',
    goals: ['Complete the welcome task'],
  },
  unlockRequirement: null, // Always available
  dialogues: {
    offer: ['I have a simple task for you.'],
    ready: ['Ready to submit?'],
    complete: ['Excellent! You completed a task in an unlocked module!'],
  },
  meta: {
    hints: ['Write about what it means to unlock a new module', 'Write at least 15 characters'],
    examples: ['I unlocked this module by completing a task!', 'This is my first unlocked module.'],
  },
});

/**
 * Task 2: Reflection Task
 * Locked until welcome task is completed
 * Shows that unlocked modules can still have task progression
 */
export const reflectionTask = createTask({
  id: 'reflection',
  name: 'Reflection',
  description: 'Reflect on what it means to unlock new modules (at least 20 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(20, (text) => {
    if (text.length >= 20) {
      return success('complete', 'Great reflection! You understand how module unlocking works.', 100);
    }
    return failure('too_short', 'Please write at least 20 characters.');
  }),
  overview: {
    requirements: 'Write at least 20 characters',
    goals: ['Complete the reflection'],
  },
  unlockRequirement: taskComplete(welcomeTask), // Locked until welcomeTask is completed
  dialogues: {
    offer: ['Now that you\'ve completed the welcome task, let\'s reflect on unlocking modules.'],
    ready: ['Ready to submit your reflection?'],
    complete: ['Perfect! You\'ve completed all tasks in this unlocked module!'],
  },
  meta: {
    hints: ['Think about how unlocking modules expands the game', 'Write at least 20 characters'],
    examples: ['Unlocking modules allows me to explore new content and challenges.', 'I learned that completing tasks can unlock new areas to explore.'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [welcomeTask, reflectionTask];

