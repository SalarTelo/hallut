/**
 * Example 3B: Module Unlock Module Tasks
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
    hints: ['Write about unlocking this module from another module', 'Write at least 15 characters'],
    examples: ['I unlocked this module by completing a special task!', 'This module was unlocked through module-to-module progression.'],
  },
});

/**
 * Task 2: Completion Task
 * Locked until welcome task is completed
 * Shows that unlocked modules can still have task progression
 */
export const completionTask = createTask({
  id: 'completion',
  name: 'Completion Task',
  description: 'Write about completing a module-unlocked module (at least 20 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(20, (text) => {
    if (text.length >= 20) {
      return success('complete', 'Excellent! You understand module-to-module unlocking.', 100);
    }
    return failure('too_short', 'Please write at least 20 characters.');
  }),
  overview: {
    requirements: 'Write at least 20 characters',
    goals: ['Complete the final task'],
  },
  unlockRequirement: taskComplete(welcomeTask), // Locked until welcomeTask is completed
  dialogues: {
    offer: ['Now that you\'ve completed the welcome task, let\'s finish this module.'],
    ready: ['Ready to submit?'],
    complete: ['Perfect! You\'ve completed all tasks in this module-unlocked module!'],
  },
  meta: {
    hints: ['Reflect on completing a module that was unlocked by another module', 'Write at least 20 characters'],
    examples: ['I completed this module that was unlocked through module progression.', 'This shows how modules can unlock each other in a chain.'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [welcomeTask, completionTask];

