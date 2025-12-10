/**
 * Showcase: Progression - Tasks
 * 
 * Demonstrates task chains and unlock requirements.
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
 * Task 1: First Task
 * 
 * Always available - starts the task chain.
 */
export const task1 = createTask({
  id: 'progression-task-1',
  name: 'Task 1: Start the Chain',
  description: 'Write "start" to begin the progression chain (at least 5 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(5, (text) => {
    const lowerText = text.toLowerCase().trim();
    if (lowerText.includes('start')) {
      return success('complete', 'Great! Task 2, the locked object, and the locked NPC are now unlocked.', 100);
    }
    return failure('missing_keyword', 'Your answer should include the word "start".');
  }),
  overview: {
    requirements: 'Write at least 5 characters including "start"',
    goals: ['Start the task chain', 'Unlock Task 2'],
  },
  unlockRequirement: null, // Always available
  dialogues: {
    offer: ['I have the first task in a chain. Complete it to unlock the next task, a locked object, and a locked NPC.'],
    ready: ['Ready to start the chain?'],
    complete: ['Excellent! Task 2, the locked object, and the locked NPC are now unlocked.'],
  },
  meta: {
    hints: ['Include the word "start"', 'Write at least 5 characters'],
    examples: ['I want to start', 'Let me start the chain'],
  },
});

/**
 * Task 2: Second Task
 * 
 * Locked until Task 1 is completed.
 * Demonstrates task chains.
 */
export const task2 = createTask({
  id: 'progression-task-2',
  name: 'Task 2: Continue the Chain',
  description: 'Write "continue" to continue the progression (at least 8 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(8, (text) => {
    const lowerText = text.toLowerCase().trim();
    if (lowerText.includes('continue')) {
      return success('complete', 'Great! Task 3 is now unlocked.', 100);
    }
    return failure('missing_keyword', 'Your answer should include the word "continue".');
  }),
  overview: {
    requirements: 'Write at least 8 characters including "continue"',
    goals: ['Continue the task chain', 'Unlock Task 3'],
  },
  unlockRequirement: taskComplete(task1), // Locked until task1 is completed
  dialogues: {
    offer: ['I have the second task. Complete it to unlock Task 3.'],
    ready: ['Ready to continue?'],
    complete: ['Excellent! Task 3 is now available.'],
  },
  meta: {
    hints: ['Include the word "continue"', 'Write at least 8 characters'],
    examples: ['I will continue', 'Let me continue the chain'],
  },
});

/**
 * Task 3: Third Task
 * 
 * Locked until Task 2 is completed.
 * Demonstrates longer task chains.
 */
export const task3 = createTask({
  id: 'progression-task-3',
  name: 'Task 3: Complete the Chain',
  description: 'Write "complete" to finish the progression chain (at least 8 characters).',
  submission: textSubmission(),
  validate: textLengthValidator(8, (text) => {
    const lowerText = text.toLowerCase().trim();
    if (lowerText.includes('complete')) {
      return success('complete', 'Excellent! You completed the entire task chain!', 100);
    }
    return failure('missing_keyword', 'Your answer should include the word "complete".');
  }),
  overview: {
    requirements: 'Write at least 8 characters including "complete"',
    goals: ['Complete the task chain'],
  },
  unlockRequirement: taskComplete(task2), // Locked until task2 is completed
  dialogues: {
    offer: ['I have the final task in the chain.'],
    ready: ['Ready to complete the chain?'],
    complete: ['Congratulations! You completed the entire task chain!'],
  },
  meta: {
    hints: ['Include the word "complete"', 'Write at least 8 characters'],
    examples: ['I will complete it', 'Let me complete the chain'],
  },
});

/**
 * All tasks for this module
 */
export const tasks = [task1, task2, task3];
